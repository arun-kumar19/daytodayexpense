const Sequelize=require('sequelize');

//it creates a connection pool
const sequelize=require('../util/database');

const userdata=sequelize.define('userdata',{
id:{
  type:Sequelize.INTEGER,
  autoIncrement:true,
  allowNull:false,
  primaryKey:true
},
name:{
type:Sequelize.STRING,
allowNull:false
},
email:{
  type:Sequelize.STRING,
  allowNull:false
},
password:{
  type:Sequelize.STRING,
  allowNull:false
},
ispremiumuser:Sequelize.BOOLEAN,
total_expenses:Sequelize.INTEGER

});
module.exports=userdata;


