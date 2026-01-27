const fs = require('fs');
const sequelize = require('./src/config/database');

async function inspect() {
    try {
        const [results, metadata] = await sequelize.query("SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'users';");
        fs.writeFileSync('db_info.json', JSON.stringify(results, null, 2));
        console.log('Successfully wrote db_info.json');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

inspect();
