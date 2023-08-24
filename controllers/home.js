const user=require('../models/userdata');
const order=require('../models/orders');
const userexpence=require('../models/userexpence');
const Sequelize=require('sequelize');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Razorpay=require('razorpay');
const secretKey = '7539753909887979q78937008988080';
const razorpay=new Razorpay({
  key_id:'rzp_test_NPB8btb7Mfqb03',
  key_secret:'UNVX2eym2FcksUvH6FzwBCtc'
});


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
  const saltRounds = 10;
  const {name,email,password}=req.body;
  console.log('values=',name,'|',email,'|',password);

  const checkUser=await user.findAll({where: {
    email:email
  }})

  console.log('checkuser=',checkUser,' userlength=',checkUser.length);
  if(checkUser.length>0){

  return res.json({'status':0})//user exists
  }
else{
  bcrypt.hash(password,saltRounds,(err,hash)=>{
    if(err)
    console.error('Error hashing password',err);
  else{
    //console.log('hash password=',hash);
  user.create({name,email,password:hash}).then(result=>{
    //console.log('user created succesfully');
    res.status(201).json({'status':1});//user created
  }).catch(err=>{
    console.log('soemthing went wrong =',err);
  })
}
})
}
}

exports.getSuccess=(req,res,next)=>{

  res.render('login',{
    status:1,
    path:'/login'
  });

}

function generateAccessToken(id){
  const token=jwt.sign(id,secretKey);
  console.log('token=',token);
  return token;
}

exports.getLogin=async(req,res,next)=>{
  let username;
  const {email,password}=req.body;
  //console.log('email1:',email,' and password1:',password);
  const checkuser=await user.findOne({where:{
    email:email,
  }})
  //console.log('checkuser=',checkuser);
  
  if(!checkuser){
    //console.log('error');
    return res.status(404).json({'status':2});
  }
      //console.log('checkuser=',checkuser.name);
      bcrypt.compare(password,checkuser.password,(err,result)=>{
        if(err){
          console.log('error=',err);
          res.status(401).json({'status':0});
        }
        else{
        if(result){
         // console.log('hello=',result);
           username=checkuser.name;
          res.status(201).json({'status':1,'userdata':checkuser,'token':generateAccessToken(checkuser.id)})
        }
        else{
          res.status(401).json({'status':0})
        }
      }
        })
  }



exports.getUserExpence=async (req,res)=>{

  const userid=req.params.id;

  const fetchuser=await userexpence.findAll({where:{
    userdatumId:userid
  }});
  console.log('result=',fetchuser);
  if(!fetchuser){
  return  res.status(406).json({'MESSAGE':'NOT ACCEPTABLE'});
  }
      res.status(201).json(fetchuser);
}


exports.getAddExpence=async (req,res)=>{
  const{money,description,category}=req.body;
  const token=req.header('Authorization');
  console.log('add expence token=',token);
  const id=jwt.verify(token,secretKey);
  console.log('Money-',money,' Description -',description, 'category-',category, 'id-',id);

  const fetchuser=await user.findByPk(id);

  const result=await fetchuser.createUserexpence({money,description,category});
 //console.log('result=',result);
  if(!result){
  return  res.status(406).json({'MESSAGE':'NOT ACCEPTABLE'});
  }
      res.status(201).json(result);
}

exports.getProfile=async(req,res)=>{
  res.render('profile',{
    path:'/profile',
  
    });
  
}

exports.getUpdatedExpence=async (req,res)=>{
  console.log('getUpdatedExpence');
  const{money,description,category}=req.body;
    const id=req.params.expenceid;
  console.log('Money-',money,' Description -',description, 'category-',category, 'id-',id);

  const fetchuser=await userexpence.findByPk(id);

  fetchuser.money=money;
  fetchuser.description=description;
  fetchuser.category=category;
  await fetchuser.save();
  const updatedrecord=await userexpence.findByPk(id);
  //console.log('result=',updatedrecord);
  if(!updatedrecord){
  return  res.status(406).json({'MESSAGE':'NOT ACCEPTABLE'});
  }
      res.status(201).json(updatedrecord);
}

exports.getEditExpence=async (req,res)=>{
  console.log('req=',req.params.expenceid);
  const id=req.params.expenceid;

  //console.log('id-',id);

  const fetchuser=await userexpence.findByPk(id);
  //console.log('result=',fetchuser);
  if(!fetchuser){
  return  res.status(406).json({'MESSAGE':'NOT ACCEPTABLE'});
  }
      res.status(201).json(fetchuser);
}

exports.getDeleteExpence=async (req,res)=>{
  const id=req.params.expenceid;

  console.log('delete expence id-',id);

  const fetchuser=await userexpence.findByPk(id);
  const expenceadminid=fetchuser.userdatumId;
  
  if(!fetchuser){
  return  res.status(406).json({'MESSAGE':'NOT ACCEPTABLE'});
  }
  //console.log('result=',fetchuser);
    await fetchuser.destroy();
    const updatedexpences=await userexpence.findAll({where :
    {
      userdatumId:expenceadminid
    }})
      res.status(201).json(updatedexpences);
}

exports.getSingleUserExpences=async (req,res)=>{
  const token=req.header('Authorization');
  console.log('user token id-',token);
  
  const id=jwt.verify(token,secretKey);

  const fetchuser=await userexpence.findAll({where:{
    userdatumId:id
  }});
  
  if(!fetchuser){
  return  res.status(406).json({'MESSAGE':'NOT ACCEPTABLE'});
  }
  //console.log('result=',fetchuser);
      res.status(201).json(fetchuser);
}

exports.getPremiumPayment=async (req,res)=>{
try{
  const token=req.header('Authorization');
  console.log('add expence token=',token);
  const id=jwt.verify(token,secretKey);
  console.log('user id-',id);

  const fetchuser=await user.findByPk(id);

  const orderAmount = 1500; // Amount in paisa (1000 paisa = ₹10)
const currency = 'INR';

const orderOptions = {
  amount: orderAmount,
  currency: currency,
};

  try{
  razorpay.orders.create(orderOptions, (err, order) => {
    if (err) {
      console.error('Error creating order:', err);
      throw new Error(JSON.stringify(err));
    }
    console.log('Order:', order);
    try{
    fetchuser.createOrder({orderid:order.id,amount:order.amount,currency:order.currency,status:'pending',payment_id:'na'}).
      then(orderstatus=>{
    if(!orderstatus){
      console.log('something went wrong=',orderstatus);
    }
     console.log('order status:',orderstatus);
     return res.status(201).json({order,key_id:razorpay.key_id});
    }).catch(err=>{
      console.log('something went wrong11=',err);
    });
    
  }
    catch(error){
      console.log('error2-',error);
    }
  });
  }catch(error){
    console.log('error3=',error);
  }
}catch(error){
  console.log('error4-',error);
  res.status(403).json({message:'something went wrong',error:error});
}

}

exports.getUpdateTransactionStatus=async(req,res)=>{
  console.log('received request from server');
  const token=req.header('Authorization');
  console.log('token=',token);
  console.log('request=',req);
  const {order_id,payment_id,order_status}=req.body;
  const id=jwt.verify(token,secretKey); 
  console.log('transaction order status=',order_status);
  try{
  const userorder=await order.findOne({where:{
    orderid:order_id
  }})
  
  if(order_status===0){
    console.log('transaction failed');
    userorder.status='failed';  
    await userorder.save();
    return res.json({'MESSAGE':'failed'});
  }
  console.log('transaction success');
  const getuser=await user.findByPk(id);
  getuser.ispremiumuser=true;
  await getuser.save();
  console.log('fetched order=',userorder);
  userorder.status='COMPLETED'
  userorder.payment_id=payment_id
  await userorder.save();
  res.status(201).json({'MESSAGE':'OK'});
}catch(error){
  console.log('error during updating record=',error);
}
}

exports.getUserStatus=async (req,res)=>{
  const token=req.header('Authorization');
  console.log('add expence token=',token);
  const id=jwt.verify(token,secretKey); 
  try{
  const userstatus=await user.findByPk(id);

  console.log('checkuser=',userstatus,' userlength=',userstatus.length);
  if(!userstatus){
  return res.status(404).json({'status':0})//user exists
  }

    res.status(201).json(userstatus.ispremiumuser);//user created
  }catch(err){
    console.log('soemthing went wrong =',err);
  }
}


