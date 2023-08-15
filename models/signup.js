const Sequelize=require('sequelize');

//it creates a connection pool
const sequelize=require('../util/database');

const customerenroll=sequelize.define('customerenroll',{
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
}

});
module.exports=customerenroll;


