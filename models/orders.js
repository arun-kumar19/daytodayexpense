const Sequelize=require('sequelize');

//it creates a connection pool
const sequelize=require('../util/database');

const order=sequelize.define('order',{
id:{
  type:Sequelize.INTEGER,
  autoIncrement:true,
  allowNull:false,
  primaryKey:true
},
orderid:{
type:Sequelize.STRING,
allowNull:false
},
amount:{
  type:Sequelize.STRING,
  allowNull:false
},
currency:{
  type:Sequelize.STRING,
  allowNull:false
},
status:{
    type:Sequelize.STRING,
    allowNull:false
  },
  payment_id:{
    type:Sequelize.STRING,
    allowNull:false
  }

});
  
module.exports=order;


