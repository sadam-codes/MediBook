
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: 'c:/Users/Muhammad Bin Nasir/MediBookAI/backend/.env' });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
    }
);

async function checkDoctors() {
    try {
        const [doctors] = await sequelize.query('SELECT * FROM doctors');
        console.log('--- DOCTORS TABLE ---');
        console.log(JSON.stringify(doctors, null, 2));

        const [users] = await sequelize.query("SELECT id, \"fullName\", role FROM users WHERE role = 'doctor'");
        console.log('--- USERS WITH DOCTOR ROLE ---');
        console.log(JSON.stringify(users, null, 2));

        await sequelize.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkDoctors();
