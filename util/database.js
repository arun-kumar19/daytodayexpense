const Sequelize=require('sequelize');
const sequelize=new Sequelize('lt_office','root','Arun@12345',
{dialect:'mysql',
host:'localhost'});

module.exports=sequelize;