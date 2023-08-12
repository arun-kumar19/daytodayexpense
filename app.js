const express=require('express');
const app=express();

const homeRoute=require('./routes/home');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(homeRoute);
app.listen(3000);

