const { User } = require('../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../../utils/logger');
const { getRelativeStoragePath } = require('../../utils/fileHelper');
const crypto = require('crypto');
const { sendEmail } = require('../../services/emailService');
const { Op } = require('sequelize');

// Helper: Generate JWT
const signToken = (id, role, isAdmin) => {
    return jwt.sign({ id, role, isAdmin }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

const register = async (req, res) => {
    try {
        const { fullName, phone, email, password, role, age, caseDescription } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            console.log(`Registration failed: User already exists (${phone})`);
            return res.status(400).json({ error: 'User already exists with this phone number.' });
        }

        // 2. Encrypt Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Handle Profile Photo
        let profileImage = null;
        if (req.file) {
            logger.info(`Profile photo uploaded for ${phone}`);
            profileImage = getRelativeStoragePath(req.file.path); // Save relative path
        }

        // 4. Create User
        const newUser = await User.create({
            fullName,
            phone,
            email,
            password: hashedPassword,
            role: role || 'patient',
            age,
            profileImage
        });

        console.log(`User registered successfully: ${newUser.fullName} (${newUser.role})`);


        // 5. Generate Token
        // New users (except seeded ones) are not admins by default, so isAdmin is false/undefined.
        // But for consistency let's pass it. Since we created it, we know it's false unless we change logic.
        // Actually, newUser.isAdmin is default false.
        const token = signToken(newUser.id, newUser.role, newUser.isAdmin);

        // 6. Send Response
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: newUser.id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    phone: newUser.phone,
                    role: newUser.role,
                    profileImage: newUser.profileImage
                }
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
};

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        console.log(`Login attempt for: ${phone}`);

        // 1. Check if email and password exist
        if (!phone || !password) {
            return res.status(400).json({ error: 'Please provide phone number and password!' });
        }

        // 2. Check if user exists && password is correct
        const user = await User.findOne({ where: { phone } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log(`Login failed (invalid credentials) for: ${phone}`);
            return res.status(401).json({ error: 'Incorrect phone number or password' });
        }

        // 3. Check if account is approved (for doctors)
        if (user.role === 'doctor' && !user.isApproved) {
            return res.status(403).json({ error: 'Your account is pending approval. Please contact the administrator.' });
        }

        console.log(`User logged in successfully: ${user.fullName}`);

        // 3. Send Token
        const token = signToken(user.id, user.role, user.isAdmin);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    isAdmin: user.isAdmin,
                    isApproved: user.isApproved,
                    profileImage: user.profileImage,
                    phone: user.phone
                }
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Please provide an email address' });
        }

        // 1. Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // We don't want to leak if a user exists or not for security reasons,
            // but for this implementation we'll keep it simple or send a generic success message.
            return res.status(404).json({ error: 'No user found with that email address.' });
        }

        // 2. Generate random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // 3. Save to database with expiry (e.g., 1 hour)
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // 4. Send token via email
        const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message,
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!',
                // For development/debugging purposes when email isn't configured:
                ...(process.env.NODE_ENV === 'development' && { resetURL })
            });

        } catch (err) {
            user.passwordResetToken = null;
            user.passwordResetExpires = null;
            await user.save();
            console.error('Email send failed:', err);
            return res.status(500).json({ error: 'There was an error sending the email. Try again later!' });
        }

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
};

const resetPassword = async (req, res) => {
    try {
        // 1. Get user based on the token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: { [Op.gt]: Date.now() }
            }
        });

        // 2. If token has not expired, and there is user, set the new password
        if (!user) {
            return res.status(400).json({ error: 'Token is invalid or has expired' });
        }

        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Please provide a new password' });
        }

        user.password = await bcrypt.hash(password, 12);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        // 3. Log the user in, send JWT
        const token = signToken(user.id, user.role, user.isAdmin);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ error: 'Reset password failed. Please try again.' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // 1. Find user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        // 3. Hash new password and save
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    changePassword
};
