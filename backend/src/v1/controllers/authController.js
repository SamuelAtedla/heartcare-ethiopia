const { User } = require('../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: Generate JWT
const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    });
};

const register = async (req, res) => {
    try {
        const { fullName, phone, password, role, age, caseDescription } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this phone number.' });
        }

        // 2. Encrypt Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Handle Profile Photo
        let profileImage = null;
        if (req.file) {
            profileImage = req.file.path; // Save file path to DB
        }

        // 4. Create User
        const newUser = await User.create({
            fullName,
            phone,
            password: hashedPassword,
            role: role || 'patient',
            age, // Store age/case for patients
            // For now, case description might go into clinical notes or specific field
            // Assuming basic user model, we might need to add these fields or store in separate table
            // Update User model later if needed for 'age' and 'caseDescription'
            profileImage
        });

        // 5. Generate Token
        const token = signToken(newUser.id, newUser.role);

        // 6. Send Response
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: newUser.id,
                    fullName: newUser.fullName,
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

        // 1. Check if email and password exist
        if (!phone || !password) {
            return res.status(400).json({ error: 'Please provide phone number and password!' });
        }

        // 2. Check if user exists && password is correct
        const user = await User.findOne({ where: { phone } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Incorrect phone number or password' });
        }

        // 3. Send Token
        const token = signToken(user.id, user.role);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    role: user.role,
                    profileImage: user.profileImage
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
