const Sequelize=require('sequelize');
//const sequelize=new Sequelize('lt_office','root','Arun@12345',
const sequelize=new Sequelize(process.env.DATABASE,process.env.USERNAME,process.env.PASSWORD,
{dialect:'mysql',
host:'localhost'});

module.exports=sequelize;