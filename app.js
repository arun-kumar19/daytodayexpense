const express=require('express');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const user=require('./models/userdata');
const userexpence=require('./models/userexpence');
const order=require('./models/orders');
const forgotpasswordrequests=require('./models/forgotpasswordrequests');
const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', 'views');
const path=require("path")
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const homeRoute = require('./routes/home');
user.hasMany(userexpence);
userexpence.belongsTo(user);
user.hasMany(order);
order.belongsTo(user);
user.hasMany(forgotpasswordrequests);
forgotpasswordrequests.belongsTo(user);
app.use(homeRoute);
sequelize.sync().then(()=>{
    console.log('Server Running........');
    app.listen(3000);
}).catch(error=>{
    console.log('error while synchnorising with database=',error);
})






