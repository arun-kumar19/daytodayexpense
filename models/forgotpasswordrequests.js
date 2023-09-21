const Sequelize=require('sequelize');

//it creates a connection pool
const sequelize=require('../util/database');

const ForgotPasswordRequests=sequelize.define('forgotpasswordrequests',{
id:{
  type:Sequelize.INTEGER,
  autoIncrement:true,
  allowNull:false,
  primaryKey:true
},
uuid:{
type:Sequelize.STRING,
allowNull:false
},
isactive:{
  type:Sequelize.BOOLEAN,
  allowNull:false
}

});
  
module.exports=ForgotPasswordRequests;


