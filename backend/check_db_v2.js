
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
        const [doctors] = await sequelize.query(`
      SELECT d.*, u."fullName", u.email, u.role
      FROM doctors d
      JOIN users u ON d."userId" = u.id
    `);
        console.log('--- DOCTOR RECORDS WITH USER INFO ---');
        console.log(JSON.stringify(doctors, null, 2));

        await sequelize.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkDoctors();
