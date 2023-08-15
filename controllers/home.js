const user=require('../models/signup');
const Sequelize=require('sequelize');


exports.getSignUp=(req,res)=>{
  
  res.render('signup',{
    path:'/',
    status:false
  })
}

exports.getSignIn=(req,res)=>{
  
  res.render('login',{
    path:'/',
    status:true
  })
}

exports.getDemo=(req,res)=>{
  
  res.render('demo',{
    path:'/demo'
  })
}

exports.getUser=async (req,res)=>{
  const {name,email,password}=req.body;
  console.log('values=',name,'|',email,'|',password);

  const checkUser=await user.findAll({where: {
    email:email
  }})

  console.log('checkuser=',checkUser,' userlength=',checkUser.length);
  if(checkUser.length>0){

  return res.json({'status':0})//user exists
  }

  user.create({name,email,password}).then(result=>{
    console.log('user created succesfully');
    res.json({'status':1});//user created
  }).catch(err=>{
    console.log('soemthing went wrong =',err);
  })
  
}

exports.getSuccess=(req,res,next)=>{

  res.render('login',{
    status:1,
    path:'/login'
  });

}


exports.getLogin=async(req,res,next)=>{
  let username;
  const {email,password}=req.body;

  console.log('email:',email,' and password:',password);

  const checkuser=await user.findAll({where:{
    email:email,
    password:password
  }})
  //console.log('checkuser=',checkuser);
  

  if(checkuser.length==0){
   return  res.render('login',{
      status:0,
      path:'/login'
    });
    } 
    if(checkuser){
    console.log('checkuser=',checkuser[0].name,' userlength=',checkuser.length);
  username=checkuser[0].name;
  res.render('profile',{
    name:username,
    path:'/profile'
  })
}

}


exports.getLogin=async(req,res,next)=>{
  let username;
  let passwordstatus;
  const {email,password}=req.body;

  console.log('email:',email,' and password:',password);

  const checkemail=await user.findOne({where:{
    email:email
  }})
console.log('result=',checkemail);
if(checkemail) {
  if(checkemail.password==password){
      passwordstatus=1;
  }
  else{
    passwordstatus=2;
  }

  if(checkemail.length==0){
    console.log('seems this condition never gets true');
   return  res.render('login',{
      status:0,
      path:'/'
    });
    } 
    if(checkemail && passwordstatus==1){/* 
    console.log('checkuser=',checkemail.name,' userlength=',checkemail.length);
  username=checkemail.name;
  res.render('profile',{
    name:username,
    path:'/profile'
  }) */

  res.json({'status':1})//password matched
}

if(checkemail && passwordstatus==2){
  /* console.log('checkuser=',checkemail.name,' userlength=',checkemail.length);
  return  res.render('login',{
    status:2,
    path:'/'
  }); */

  res.status(401).json({'status':0})//password not matched
}

}

else{

  res.status(404).json({'status':3})//user not found
  
}

}