const { User } = require('../src/models');
const sequelize = require('../src/config/database');

const updateAdmin = async () => {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Database connected.');

        const phone = '0911728203'; // Dr. Yebeltal's phone
        console.log(`Searching for user with phone: ${phone}`);

        const user = await User.findOne({ where: { phone } });

        if (!user) {
            console.error('User not found!');
            process.exit(1);
        }

        console.log(`User found: ${user.fullName}. Updating...`);
        user.isAdmin = true;
        user.isApproved = true;
        await user.save();

        console.log('✅ User updated successfully: isAdmin=true, isApproved=true');
    } catch (error) {
        console.error('❌ Error updating admin:', error);
    } finally {
        await sequelize.close();
    }
};

updateAdmin();
