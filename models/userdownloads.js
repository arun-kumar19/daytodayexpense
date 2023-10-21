const Sequelize=require('sequelize');

//it creates a connection pool
const sequelize=require('../util/database');

const userdownloads=sequelize.define('userdownloads',{
id:{
  type:Sequelize.INTEGER,
  autoIncrement:true,
  allowNull:false,
  primaryKey:true
},
userid:{
    type:Sequelize.INTEGER,
    allowNull:false,
  },
downloadurl:{
type:Sequelize.STRING,
allowNull:false
}
});
  
module.exports=userdownloads;


