const order=require('../models/orders');
const user=require('../models/userdata');
const userexpence=require('../models/userexpence');
const Sequelize=require('sequelize');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Razorpay=require('razorpay');
const sequelize = require('../util/database');
const secretKey = '7539753909887979q78937008988080';
const sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const ForgotPasswordRequests = require('../models/forgotpasswordrequests');
const moment=require("moment");
var data_exporter = require('json2csv').Parser;

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

 // console.log('checkuser=',checkUser,' userlength=',checkUser.length);
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
  const{date,expencetype,money,description,category}=req.body;
  const token=req.header('Authorization');
  const id=jwt.verify(token,secretKey);
  const t=await sequelize.transaction();
  const fetchuser=await user.findByPk(id);
 
  const date1=moment(date).format('YYYY-MM-DD');
  console.log('date1=',date1);

    userexpence.create({date:date1,type:expencetype,money,description,category,userdatumId:id},{transaction:t}).then(async(expense)=>{
     
      let current_expences=Number(fetchuser.total_expenses)+Number(money);
      console.log('current_expences=',current_expences);
      user.update({total_expenses:current_expences},
      {  where:{
          id:id
        },transaction:t
      }).then(async(result)=>{
        console.log("result=",result);
        if(result){
          await t.commit();
          res.status(200).json({MESSAGE:'success',data:expense});
        }
      }).catch(async(err)=>{
        console.log('something went wrong=',err);
        await t.rollback();
        res.status(500).json({MESSAGE:'failed',data:'na'})
      })
}).catch(err=>{
  console.log('soemthing went wrong2=',err);
})
}

exports.getProfile=async(req,res)=>{
  //const userid=req.params.id
  res.render('profile',{
    path:'/profile',
    //id:userid,
    });
  
}

exports.getUpdatedExpence=async (req,res)=>{
  console.log('getUpdatedExpence');
  const{money,description,category}=req.body;
  const token=req.header('Authorization');
  console.log('user token id-',token);
  const tokenid=jwt.verify(token,secretKey);
    const id=req.params.expenceid;
  console.log('Money-',money,' Description -',description, 'category-',category, 'id-',id);
try{
  const fetchuser=await userexpence.findByPk(id);
  const getUser=await user.findByPk(tokenid)
 
  getUser.total_expenses=Number(getUser.total_expenses)-Number(fetchuser.money)+Number(money)
    await getUser.save();

  
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
  catch(error){
    console.log('error while updateing expense=',error);
  }
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
  const expenceid=req.params.expenceid;
  const token=req.header('Authorization');
  const userid=jwt.verify(token,secretKey);
  console.log('User Id=',userid, " and expence id=",expenceid);
  const t2=await sequelize.transaction();
  const fetchExpence=await userexpence.findByPk(expenceid);
  //console.log('fetchExpence=',fetchExpence);
  const getUser=await user.findByPk(userid);
  console.log('getUser id=',getUser.id, 'and expenceid=',expenceid);
  const updatedExpense=Number(getUser.total_expenses)-Number(fetchExpence.money);
  console.log('updatedExpense=',updatedExpense);
  
    user.update(
        {
        total_expenses:updatedExpense
        },{
          where:{
            id:userid
          }
         // ,transaction:t2
        }).then(async(result2)=>{
            console.log('result2=',result2);

            userexpence.destroy({
              where:{id:expenceid}}
              ,{transaction:t2}
              ).then(async(result)=>{
                        console.log('deleted result=',result);
        if(result){
        //await getUser.save();
        await t2.commit();
          console.log('result=',result);
          res.status(200).json(fetchExpence);
        }
      }).catch(async(error)=>{
    console.log('something went wrong=',error);
      await t2.rollback();
      res.status(500).json({'MESSAGE':'FAILED'});  
    }
  ).catch(err=>{
  console.log('soemthing went wrong2=',err);
})
})
}

exports.getSingleUserExpences=async (req,res)=>{
  const token=req.header('Authorization');
  console.log('user token id-',token);
  
  const id=jwt.verify(token,secretKey);

  const fetchuser=await userexpence.findAll({where:{
    userdatumId:id
  },
order:[
  ['date','ASC'],
  ['type','ASC']
  
]});
  
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
  //console.log('add expence token=',token);
  const id=jwt.verify(token,secretKey); 
  try{
  const userstatus=await user.findByPk(id);
  //console.log('userstatus=',userstatus);

  //console.log('checkuser=',userstatus,' userlength=',userstatus.length);
  if(!userstatus){
  return res.status(404).json({'status':0})//user exists
  }

    res.status(201).json(userstatus);//user created
  }catch(err){
    console.log('soemthing went wrong =',err);
  }
}

exports.getLeaderBoard=async (req,res)=>{
  
  try{
    const groupbyuser = await user.findAll({
      order: [
        ['total_expenses', 'DESC'],
    ],
      attributes: ['name','total_expenses'],

    })
  //console.log('checkuser=',groupbyuser,' userlength=',groupbyuser.length);
  if(!groupbyuser){
  return res.status(404).json({'status':0})//user exists
  }

    res.status(201).json(groupbyuser);//user created
  }catch(err){
    console.log('soemthing went wrong =',err);
  }
}

exports.getForgetPasswordUser=async (req,res)=>{

  
  res.render('forgetpassword',{
    path:'/forgetpassword'
  })
  
}

exports.getForgetPassword=async (req,res)=>{

  const emailid=req.params.emailid;
  console.log('email=',emailid);
  const uuid=uuidv4(); //'9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  console.log("uuid=",uuid);
  const userdata=await user.findAll({where:{
    email:emailid
  }});

  //console.log('userdata:',userdata);
  if(!userdata){
    res.status(500).json({status:0});

  }
  const userid=userdata[0].id;
  console.log('userid=',userid);

  const status=await ForgotPasswordRequests.create({uuid,isactive:true,userdatumId:userid});

  if(!status){
    console.log('something went wrong in forgotpasswordrequests=',status);
  }
  else{
  var defaultClient = sib.ApiClient.instance;
  
  // Configure API key authorization: api-key
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey ='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';
  
  
  var apiInstance = new sib.TransactionalEmailsApi();

  const receivers=[
    {
       "email":emailid
    }
  ];
  const sender={ 
      "email":"arunklt21@gmail.com", 
      "name":"Arun Kumar"
    };
  
  
  apiInstance.sendTransacEmail({
    sender,
    to:receivers,
    subject:"Forget Password",
    "htmlContent": `
    <!DOCTYPE html><html><body><h1>Generate New Password</h1>
    <p><a href="http://127.0.0.1:3000/password/resetpassword/{{params.id}}">Change Password</a></p></body></html>`,
    params: {
      id:uuid,  
    },

  }).then(function(data) {
    console.log('API called successfully. Returned data: ' + data);
    res.status(200).json({status:1});
  }).catch(function(error) {
    console.error('GETTING ERROR=',error);
    res.status(500).send('Error sending email.');
  });
}
}

exports.getChangePassword=async (req,res)=>{

  const forgotpasswordrequestid=req.params.forgotpasswordrequestid;

  const getStatus=await ForgotPasswordRequests.findAll({where:{
    uuid:forgotpasswordrequestid
  }})

  console.log('getStatus=',getStatus[0].isactive);
  if(getStatus[0].isactive){
  res.render('changepassword',{
    path:'changePassword'
  })
}
else
{
  res.status(404).send("link expired");
}
}

exports.getChangePasswordUser=async (req,res)=>{
  const saltRounds = 10;
  const newpassword=req.body.updatedpassword;
  const forgotpasswordrequestid=req.params.userid;

  console.log('newpassword:',newpassword,' forgotpasswordrequestid:',forgotpasswordrequestid);

  const getRequest=await ForgotPasswordRequests.findAll({where:{
    uuid:forgotpasswordrequestid}}
    );
    console.log('getRequest=',getRequest);
  const userid=getRequest[0].userdatumId;
  const getUser=await user.findByPk(userid);
  const emailid=getUser.email;
  const getForgetPasswordRequest=await ForgotPasswordRequests.findAll({where:{
    uuid:forgotpasswordrequestid
  }})
  //console.log('userid of user:',userid, ' emailid=',emailid, ' and getForgetPasswordRequest=',getForgetPasswordRequest[0].isactive);
  //console.log('getUser Data:',getUser);
  bcrypt.hash(newpassword,saltRounds,(err,hash)=>{
    if(err){
    console.error('Error hashing password',err);
    }
  else{
    //console.log('hash password=',hash);
    getUser.update({password:hash}).then(async(result)=>{
      await getUser.save();
      getForgetPasswordRequest[0].isactive=false;
      getForgetPasswordRequest[0].save();
      //console.log("getForgetPasswordRequest=",getForgetPasswordRequest);
    
    console.log('password updated succesfully')
  
    //email for update password
    var defaultClient = sib.ApiClient.instance;
  
    // Configure API key authorization: api-key
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = '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';
    
    
    var apiInstance = new sib.TransactionalEmailsApi();
  
    const receivers=[
      {
         "email":emailid
      }
    ];
    const sender={ 
        "email":"arunklt21@gmail.com", 
        "name":"Arun Kumar"
      };
    
    
    apiInstance.sendTransacEmail({
      sender,
      to:receivers,
      subject:"Password Changed Successfully",
      "htmlContent": `
      <!DOCTYPE html><html><body><h1>Login Now from given link</h1>
      <p><a href="http://127.0.0.1:3000/login">Login Now</a></p></body></html>`
  
    }).then(function(data) {
      console.log('API called successfully. Returned data: ' + data);
    }).catch(function(error) {
      console.error('GETTING ERROR=',error);
      res.status(500).send('Error sending email.');
    });

    res.status(200).json({ispasswordchanged:1});
  }).catch(err=>{
    console.log('soemthing went wrong =',err);
  })
}
})
  }


exports.getExport=async(request, response, next)=>{
    const token=request.params.token;
    console.log('token=',token);
  const userid=jwt.verify(token,secretKey);
  console.log('userid=',userid);
  userexpence.findAll({ where :{
    userdatumId:userid
  }}).then(data=>{
      console.log('data=',data);
        var mysql_data = JSON.parse(JSON.stringify(data));
       
        //convert JSON to CSV Data

        var file_header = ['A', 'B', 'C', 'D','E','F','G','H','I'];

        var json_data = new data_exporter({file_header});
        if(data.length>0){
        var csv_data = json_data.parse(mysql_data);
      }
      else{
        var csv_data = json_data.parse({'A':'na','B':'na','C':'na','D':'na','E':'na','F':'na','G':'na','H':'na','I':'na',});
      }
        console.log('csv_data=',csv_data);
        response.setHeader("Content-Type", "text/csv");

        response.setHeader("Content-Disposition", "attachment; filename=sample_data.csv");

        response.status(200).end(csv_data);

    }).catch(error=>{
      console.log('there is some error=',error);
    })

}
