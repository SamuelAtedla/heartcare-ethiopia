const { User } = require('../models');
const bcrypt = require('bcryptjs');

const seedDefaultDoctor = async () => {
    try {
        const doctorPhone = '0911728203';

        // Check if doctor already exists
        const existingDoc = await User.findOne({ where: { phone: doctorPhone } });

        if (existingDoc) {
            console.log('✅ Default doctor profile already exists.');
            return;
        }

        console.log('🌱 Seeding default doctor profile...');

        const hashedPassword = await bcrypt.hash('doctor123', 12);

        await User.create({
            fullName: "Dr. Yibeltal Assefa Tedla, MD, FACC",
            phone: doctorPhone,
            password: hashedPassword,
            role: 'doctor',
            specialty: "Adult Cardiologist | Internal Medicine Specialist",
            profileImage: "https://i.pravatar.cc/300?u=dr_yibeltal_real",
            bio: `Adult Cardiologist | Internal Medicine Specialist
📍 Addis Ababa, Ethiopia | 📞 +251 911 728 203

Adult Cardiologist committed to academic excellence, procedural competence, and evidence-based cardiovascular care. Currently aiming to advance interventional cardiology services in Ethiopia.`,
            credentials: "MD, FACC, CCKE (ACC Certified)"
        });

        console.log('🚀 Default doctor profile seeded successfully.');
        console.log('-----------------------------------------------');
        console.log('Doctor Login:');
        console.log('Phone: ' + doctorPhone);
        console.log('Password: doctor123');
        console.log('-----------------------------------------------');

    } catch (error) {
        console.error('❌ Error seeding default doctor:', error);
    }
};

module.exports = { seedDefaultDoctor };
