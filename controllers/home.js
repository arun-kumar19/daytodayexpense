const user=require('../models/signup');


exports.getSignUp=(req,res)=>{
  
  res.render('signup',{
    path:'/',
    status:false
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

  return res.render('signup',{
      status:1,
      path:'/'
    })
  }

  user.create({name,email,password}).then(result=>{
    console.log('user created succesfully');
    res.redirect('/login');
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