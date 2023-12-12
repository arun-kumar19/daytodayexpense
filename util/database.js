require('dotenv').config();
const Sequelize=require('sequelize');
console.log('USERNAME=',process.env.USER_NAME);
//const sequelize=new Sequelize('lt_office','root','Arun@12345',
const sequelize=new Sequelize(process.env.DATABASE,process.env.USER_NAME,process.env.PASSWORD,
{dialect:'mysql',
host:process.env.DB_HOST});

module.exports=sequelize;