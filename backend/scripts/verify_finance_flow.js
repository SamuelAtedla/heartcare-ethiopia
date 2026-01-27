const axios = require('axios');
const { User } = require('../src/models');
const sequelize = require('../src/config/database');
const { v4: uuidv4 } = require('uuid');

const API_URL = 'http://localhost:5000/v1';

const runVerification = async () => {
    try {
        console.log('🔵 Connecting to database for setup...');
        await sequelize.authenticate();

        // 1. Setup Request Admin
        const adminPhone = `09${Math.floor(Math.random() * 90000000) + 10000000}`; // Random phone
        const adminPassword = 'password123';

        log(`🔵 Creating temporary Admin user (${adminPhone})...`);
        const adminUser = await User.create({
            fullName: 'Test Admin',
            phone: adminPhone,
            email: `admin_${uuidv4()}@test.com`,
            password: adminPassword, // Will be hashed by hook? No, User model in this project uses explicit hash in controller usually. 
            // Wait, looking at authController, hashing happens in controller. User model might not have hooks for hashing?
            // Checking: User.js doesn't show beforeCreate hook for hashing.
            // So I need to hash it manually? Or just use the API to register?
            // I'll check if I can register an admin? No, register is for patients.
            // I'll manually hash it.
            role: 'doctor', // Admin usually has a role, maybe doctor or admin? Schema showed isAdmin boolean.
            isAdmin: true,
            isApproved: true
        });

        // NOTE: If the User model doesn't hash password automatically, I need to do it.
        // authController uses bcrypt.hash.
        const bcrypt = require('bcryptjs');
        adminUser.password = await bcrypt.hash(adminPassword, 12);
        await adminUser.save();

        log('✅ Admin created.');

        // 2. Login as Admin
        log('🔵 Logging in as Admin...');
        const adminLoginRes = await axios.post(`${API_URL}/auth/login`, {
            phone: adminPhone,
            password: adminPassword
        });
        const adminToken = adminLoginRes.data.token;
        log('✅ Admin Logged In.');

        // 3. Create Finance User
        const financePhone = `09${Math.floor(Math.random() * 90000000) + 10000000}`;
        const financePassword = 'initialPassword123';

        log(`🔵 Creating Finance User (${financePhone}) via Admin API...`);
        await axios.post(`${API_URL}/admin/create-finance-user`, {
            fullName: 'Test Finance',
            phone: financePhone,
            email: `finance_${uuidv4()}@test.com`,
            password: financePassword
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        log('✅ Finance User Created.');

        // 4. Login as Finance User (First Time)
        log('🔵 Logging in as Finance User (First Time)...');
        const financeLoginRes = await axios.post(`${API_URL}/auth/login`, {
            phone: financePhone,
            password: financePassword
        });

        if (financeLoginRes.data.requirePasswordChange) {
            log('✅ Correctly received requirePasswordChange flag.');
        } else {
            log('❌ Failed: Did NOT receive requirePasswordChange flag.');
            process.exit(1);
        }

        const financeTempToken = financeLoginRes.data.token;

        // 5. Change Password
        log('🔵 Changing Initial Password...');
        const newPassword = 'newSecretPassword123';
        await axios.patch(`${API_URL}/auth/change-initial-password`, {
            newPassword: newPassword,
            confirmPassword: newPassword
        }, {
            headers: { Authorization: `Bearer ${financeTempToken}` }
        });
        log('✅ Password Changed.');

        // 6. Login with New Password
        log('🔵 Logging in with New Password...');
        const financeNewLoginRes = await axios.post(`${API_URL}/auth/login`, {
            phone: financePhone,
            password: newPassword
        });

        if (financeNewLoginRes.data.requirePasswordChange) {
            log('❌ Failed: Still asking for password change.');
            process.exit(1);
        }
        log('✅ Login successful with new password.');
        const financeToken = financeNewLoginRes.data.token;

        // 7. Access Transactions
        log('🔵 Accessing Transactions View...');
        await axios.get(`${API_URL}/finance/transactions`, {
            headers: { Authorization: `Bearer ${financeToken}` }
        });
        log('✅ Transactions Accessed.');

        // 8. Access Restricted Patient Info
        log('🔵 Attempting to Access Restricted Patient Info (Expect 403)...');
        try {
            await axios.get(`${API_URL}/doctor/search-patients?query=test`, {
                headers: { Authorization: `Bearer ${financeToken}` }
            });
            log('❌ Failed: Finance user should NOT be able to access patient search.');
        } catch (error) {
            if (error.response && error.response.status === 403) {
                log('✅ Correctly received 403 Forbidden.');
            } else {
                log(`❌ Unexpected error: ${error.message}`);
            }
        }

        log('🎉 VERIFICATION SUCCESSFUL!');

    } catch (error) {
        log('❌ Verification Failed: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
    } finally {
        await sequelize.close();
    }
};

runVerification();
