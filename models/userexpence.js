const Sequelize=require('sequelize');

//it creates a connection pool
const sequelize=require('../util/database');

const userexpence=sequelize.define('userexpence',{
id:{
  type:Sequelize.INTEGER,
  autoIncrement:true,
  allowNull:false,
  primaryKey:true
},
money:{
type:Sequelize.INTEGER,
allowNull:false
},
description:{
  type:Sequelize.STRING,
  allowNull:false
},
category:{
  type:Sequelize.STRING,
  allowNull:false
}

});
module.exports=userexpence;


