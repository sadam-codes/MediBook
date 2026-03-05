const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
});

async function checkAppointments() {
    try {
        const appointments = await sequelize.query("SELECT * FROM appointments", { type: sequelize.QueryTypes.SELECT });
        console.log("APPROWS:", JSON.stringify(appointments, null, 2));

        const users = await sequelize.query("SELECT id, \"fullName\", role FROM users", { type: sequelize.QueryTypes.SELECT });
        console.log("USERROWS:", JSON.stringify(users, null, 2));

        const doctors = await sequelize.query("SELECT id, \"userId\", specialization FROM doctors", { type: sequelize.QueryTypes.SELECT });
        console.log("DOCROWS:", JSON.stringify(doctors, null, 2));
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

checkAppointments();
