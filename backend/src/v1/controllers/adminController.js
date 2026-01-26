const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const logger = require('../../utils/logger');
const { getRelativeStoragePath } = require('../../utils/fileHelper');

exports.createDoctor = async (req, res) => {
    try {
        const { fullName, phone, email, password, specialty, bio } = req.body;

        // 1. Check if user exists
        const existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this phone number.' });
        }

        // 2. Encrypt Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Handle File Upload (Reuse logic if possible or keep simple)
        let profileImage = null;
        if (req.file) {
            profileImage = getRelativeStoragePath(req.file.path);
        }

        // 4. Create Doctor
        const newDoctor = await User.create({
            fullName,
            phone,
            email,
            password: hashedPassword,
            role: 'doctor',
            specialty,
            bio,
            profileImage,
            isApproved: true, // Auto-approved by Admin
            isAdmin: false
        });

        logger.info(`Admin created new doctor: ${newDoctor.fullName}`);

        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: newDoctor.id,
                    fullName: newDoctor.fullName,
                    email: newDoctor.email,
                    phone: newDoctor.phone,
                    role: newDoctor.role
                }
            }
        });

    } catch (error) {
        console.error('Create Doctor Error:', error);
        res.status(500).json({ error: 'Failed to create doctor.' });
    }
};
