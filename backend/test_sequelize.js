
const { Sequelize, DataType, Model } = require('sequelize');
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

class User extends Model { }
User.init({
    fullName: DataType.STRING,
    email: DataType.STRING,
    role: DataType.STRING,
    profileImage: DataType.STRING
}, { sequelize, modelName: 'user', tableName: 'users' });

class Doctor extends Model { }
Doctor.init({
    specialization: DataType.STRING,
    isAvailable: DataType.BOOLEAN,
    userId: DataType.INTEGER
}, { sequelize, modelName: 'doctor', tableName: 'doctors' });

Doctor.belongsTo(User, { foreignKey: 'userId' });

async function checkSequelize() {
    try {
        const doctors = await Doctor.findAll({
            include: [{
                model: User,
                attributes: ['id', 'fullName', 'email', 'role', 'profileImage']
            }],
            where: { isAvailable: true }
        });
        console.log('--- SEQUELIZE RESULT ---');
        console.log(JSON.stringify(doctors, null, 2));

        await sequelize.close();
    } catch (err) {
        console.error('Sequelize Error:', err);
    }
}

checkSequelize();
