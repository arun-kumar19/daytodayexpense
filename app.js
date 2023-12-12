const express=require('express');
const bodyParser = require('body-parser');
const fs=require("fs");
const sequelize=require('./util/database');
const user=require('./models/userdata');
const userexpence=require('./models/userexpence');
const order=require('./models/orders');
const forgotpasswordrequests=require('./models/forgotpasswordrequests');
const app=express();
const helmet=require("helmet");
const compression=require("compression");
const morgan=require("morgan");
app.use(compression());
require('dotenv').config();
//app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.set('view engine', 'html');
app.set('views', 'views');
const path=require("path")
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
const homeRoute = require('./routes/home');
const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})
app.use(morgan('combined',{stream:accessLogStream}))
//app.use(helmet());user.hasMany(userexpence);
userexpence.belongsTo(user);
user.hasMany(order);
order.belongsTo(user);
user.hasMany(forgotpasswordrequests);
forgotpasswordrequests.belongsTo(user);
app.use(homeRoute);
sequelize.sync().then(()=>{
    console.log('Server Running........');
    console.log('app path=',path.join(__dirname, 'public'));
    app.listen(process.env.PORT || 3000);
}).catch(error=>{
    console.log('error while synchnorising with database=',error);
})






