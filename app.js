const express=require('express');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const user=require('./models/userdata');
const userexpence=require('./models/userexpence');
const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', 'views');
 
app.use(bodyParser.json());

const homeRoute = require('./routes/home');

user.hasMany(userexpence);
userexpence.belongsTo(user);

app.use(homeRoute);

sequelize.sync().then(()=>{
    console.log('Server Running........');
    app.listen(5000);
}).catch(error=>{
    console.log('error while synchnorising with database=',error);
})






