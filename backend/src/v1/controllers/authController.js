const { User } = require('../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../../utils/logger');
const { getRelativeStoragePath } = require('../../utils/fileHelper');

// Helper: Generate JWT
const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
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
        const token = signToken(newUser.id, newUser.role, newUser.phone);

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

        console.log(`User logged in successfully: ${user.fullName}`);

        // 3. Send Token
        const token = signToken(user.id, user.role, user.phone);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
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

module.exports = {
    register,
    login
};
