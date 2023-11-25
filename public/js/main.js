const tokendata=localStorage.getItem('token');
const abc=JSON.parse(tokendata)
const token=abc.tokenid;
const pagination_number_div=document.getElementById("pagination");

async function fetchexpences(page=1){
    
    const downloadId=document.getElementById("exportdata");
    const newUrl="/export/".concat(token);
     downloadId.href=newUrl;
     downloadId.className="btn btn-primary"
     console.log('localStorage perPageData=',localStorage.getItem('perPageData'));
     if(localStorage.getItem('perPageData')==null){
      alert('hello');
     };
     const value=localStorage.getItem('perPageData')||2;
     console.log('PerPageData Default Value=',value);
    document.getElementById("dropdown").value=value
   
   const ispremiumuser=abc.ispremiumuser  ;
    const perPageData=localStorage.getItem('perPageData')||2;
  console.log('token-',token,' ispremiumuser-',ispremiumuser);
    try{
      const response=await axios.get(`userexpences?page=${page}`,{headers:{'Authorization':token,'perPageData':perPageData}});
      console.log('response=',response.data);
      const user=response.data.userdata;
      let currentPage=response.data.currentPage;
      const totalItems=response.data.totalItems;
      const totalPages=response.data.totalPages;
      const nextPage=response.data.nextPage;
      const datalength=response.data.userdata.length;
      //console.log('datalength=',datalength);
      const date=response.data.uniqueDate;
      //console.log('fetch user data=',user);
     // console.log('fetch user date=',date);
      const userstatus=await axios.get('userstatus',{headers:{'Authorization':token}});
      //console.log('userstatus=',userstatus)
      if(userstatus){
    const username=userstatus.data.name;
//        console.log('userstatus=',user, 'username=',username);
    const formatString=`Welcome ${username}!`;
    document.getElementById('username').innerText=formatString
  
      }
    
    if(ispremiumuser){
        const multipleclass='btn btn-success'
      document.getElementById('buypremium').textContent='You are a premium user';
      const div=document.getElementById("leaderboard");
      const button=document.createElement("button");
      button.className=multipleclass;
      button.onclick=showleaderboard;
      button.type="submit"
      button.textContent="Leader Board";
      div.appendChild(button);
    }
//    console.log('loaded content=',user.length); 
let table = document.getElementById("tableBody");
let expencesTotal=0;
let incomeTotal=0;
   const userList = document.getElementById('expencelist');

    // Render each user as a list item
      for(let j=0;j<date.length;j++){
        let userstatus=false;
        let expencesTotalByDate=0;
         let  incomeTotalByDate=0;

        for(let i=0;i<user.length;i++){
       
//console.log('date=',date[j], 'user date=',user[i].date, 
//          'date type=',typeof date[j], 'userdate type=',typeof user[i].date, 'is equal=',date[j]==user[i].date);
        if(date[j]==user[i].date){
          //console.log('true');
          userstatus=true;
        document.getElementById("userexpences").textContent="All Expenses and Income"
      const listItem = document.createElement('li');
        const editButton=document.createElement('button');
        editButton.value='Edit';
        editButton.id=user[i].id;
        editButton.textContent='Edit';
        editButton.className='editItem';
        editButton.onclick=editItem;
        const deleteButton=document.createElement('button');
        deleteButton.value='delete';
        deleteButton.id=user[i].id;
        deleteButton.onclick=deleteItem;
        deleteButton.className='deleteItem';
        deleteButton.textContent='Delete';
        const previousdate=user[i].date;
        const value= `${user[i].date} ${user[i].money} ${user[i].description} ${user[i].category} `;
//        console.log('format=',value);
    
let row = document.createElement("tr")

// Create cells
let c1 = document.createElement("td")
let c2 = document.createElement("td")
let c3 = document.createElement("td")
let c4 = document.createElement("td")
let c5= document.createElement("td")

// Insert data to cells
c1.innerText =user[i].date;
c2.innerText = user[i].description;
c3.innerText = user[i].category

// Append cells to row

if(user[i].type===1){
c4.innerText = user[i].money;
incomeTotalByDate+=user[i].money;
incomeTotal+=user[i].money;
}
if(user[i].type===2){
c5.innerText = user[i].money;
expencesTotalByDate+=user[i].money;
expencesTotal+=user[i].money;
}

row.appendChild(c1);
row.appendChild(c2);
row.appendChild(c3);
row.appendChild(c4);
row.appendChild(c5);
// Append row to table body
table.appendChild(row)

}

}
if(userstatus){
let rowByDate = document.createElement("tr")

// Create cells
let c1 = document.createElement("td")
let c2 = document.createElement("td")
let c3 = document.createElement("td")
let c4 = document.createElement("td")
let c5= document.createElement("td")

// Insert data to cells
c1.innerText ="";
c2.innerText = "";
c3.innerText = ""
c4.innerText = incomeTotalByDate;
c5.innerText = expencesTotalByDate


rowByDate.appendChild(c1);
rowByDate.appendChild(c2);
rowByDate.appendChild(c3);
rowByDate.appendChild(c4);
rowByDate.appendChild(c5);
rowByDate.className="table-success"
// Append row to table body
table.appendChild(rowByDate)

}
}
if(currentPage==totalPages){
let finalrow = document.createElement("tr")

// Create cells
let c1 = document.createElement("td")
let c2 = document.createElement("td")
let c3 = document.createElement("td")
let c4 = document.createElement("td")
c4.className="text-success";
let c5= document.createElement("td")
c5.className="text-danger";

// Insert data to cells
c1.innerText ="";
c2.innerText = "";
c3.innerText = ""
c4.innerText = '₹'+incomeTotal;
c5.innerText = '₹'+expencesTotal


finalrow.appendChild(c1);
finalrow.appendChild(c2);
finalrow.appendChild(c3);
finalrow.appendChild(c4);

finalrow.appendChild(c5);
finalrow.className="table-success"
// Append row to table body
table.appendChild(finalrow)


let summaryrow = document.createElement("tr")

// Create cells
let cf1 = document.createElement("td")
let cf2 = document.createElement("td")
let cf3 = document.createElement("td")
let cf4 = document.createElement("td")
cf4.className="text-primary";
let cf5= document.createElement("td")
cf5.className="text-primary";

// Insert data to cells
cf1.innerText ="";
cf2.innerText = "";
cf3.innerText = ""
if(incomeTotal>=expencesTotal){
cf4.innerText = "Savings INR";
cf5.innerText ='₹'+(incomeTotal-expencesTotal);
}

else{
cf4.innerText = "Expences INR";
cf5.innerText = '₹'+(expencesTotal-incomeTotal);
}

summaryrow.appendChild(cf1);
summaryrow.appendChild(cf2);
summaryrow.appendChild(cf3);
summaryrow.appendChild(cf4);
summaryrow.appendChild(cf5);
summaryrow.className="table-success"
// Append row to table body
table.appendChild(summaryrow)  

}
//pagination data

  const button1=document.createElement("button")
  button1.id="pre-btn"
  button1.innerHTML=currentPage;
  button1.className="btn btn-primary"
  
  pagination_number_div.appendChild(button1);
if(Number(currentPage)<Number(totalPages)){
if(currentPage<nextPage){
  const button2=document.createElement("button")
  button2.id="next-btn"
  button2.innerHTML=nextPage;
  button2.className="btn btn-primary"

pagination_number_div.appendChild(button2);

document.getElementById("next-btn").addEventListener("click",()=>{
  if(currentPage<totalPages){
    console.log('onload next');
    currentPage++;
    pagination(Number(currentPage),"next");
    }
})
}
if(Number(nextPage)<Number(totalPages)){
const button3=document.createElement("button")
button3.id="next-btn1"
button3.innerHTML=totalPages;
button3.className="btn btn-primary"

pagination_number_div.appendChild(button3);

document.getElementById("next-btn1").addEventListener("click",()=>{
  console.log('lastPage');
  pagination(Number(totalPages),"pre");
})

}

}


//showing downloading url
const list=document.getElementById("downloadlist");

try{
const responseUrl=await axios.get("urllist",{headers:{Authorization:token}})
//console.log('responseUrl:',responseUrl.data.urldata);
const json_array=responseUrl.data.urldata;
json_array.forEach(function(obj) {

  var a = document.createElement('a');
  var linkText = document.createTextNode(obj['createdAt'].substring(0,10)+" "+obj['createdAt'].substring(11,16)+" "+obj['downloadurl']);
  a.appendChild(linkText);
  a.title = obj['downloadurl'];
  a.href = obj['downloadurl'];
var li=document.createElement("li");
li.setAttribute("id", obj.index)
li.appendChild(a);
list.appendChild(li);
});

}
catch(error){
console.log('something went wrong:',error);
}
//uploading and redering code above

async function editItem(event){

const id=event.target.id;
//console.log('edit item id=',id);
console.log('edit product fun2 called and id is=',event.target.id);

try{
const response=await axios.get(`/editexpence/${id}`);

const user = response.data;
console.log('response=',user);
// Get the <ul> element to append the users
const userList = document.getElementById('expencelist');

// Render each user as a list item

document.getElementById('money').value=user.money;
document.getElementById('description').value=user.description;
document.getElementById('category').value=user.category;
//document.getElementById('userid').value=user.id;
document.getElementById('submit').innerHTML='Update Product';
document.getElementById('submit').onclick=UpdateProduct;
document.getElementById('expenceid').value=user.id;
const li=event.target.parentElement;
console.log('li=',li);
userList.removeChild(li);      
}
catch(error){
console.log('getting error while fetching data from server =',error);

}
} //edit function closed

async function deleteItem(event){
console.log('product deleted  fun1 successfully');
// alert(event.target.id)
const id=event.target.id;
console.log('value of id=',id);
console.log(`Button ${id} was clicked.`);
try{
const response=await axios.delete(`/deleteexpence/${id}`,{headers:{'Authorization':token}})
console.log('delete response=',response);

if(response){
console.log('User Deleted :',response.data)
const userList = document.getElementById('expencelist');
const li=event.target.parentElement;
console.log(li);

userList.removeChild(li);

}
else{
console.log('something went wrong');
}

}catch(error){
console.log('getting error while fetching data from server =',error);

}

} //delete function closed

async function UpdateProduct(event){

console.log('update product1 function called');
const id=document.getElementById('expenceid').value;
console.log('update expence id=',id);
const money=document.getElementById('money').value;
const description=document.getElementById('description').value;
const category=document.getElementById('category').value;
const buttonSubmit=document.getElementById('submit');
const tokendata=localStorage.getItem('token');
    const abc=JSON.parse(tokendata)
  const token=abc.tokenid;
  const ispremiumuser=abc.ispremiumuser;

const jsonData = {
money: money,
description: description,
category: category,
};

console.log('JSON=',jsonData);
try{
const response=await axios.put(`/updateexpence/${id}`,jsonData,{headers:{'Authorization':token}});
const user=response.data;
console.log('User Updated :',user);

const userList = document.getElementById('expencelist');
    
    // Render each user as a list item
      const listItem = document.createElement('li');
        const editButton=document.createElement('button');
        editButton.value='Edit';
        //editButton.id=user.id;
        editButton.textContent='Edit';
        editButton.onclick=editItem;
        const deleteButton=document.createElement('button');
        deleteButton.value='delete';
        //deleteButton.id=user.id;
        deleteButton.onclick=deleteItem;
        deleteButton.textContent='Delete';

       const value= `${user.date} ${user.money} ${user.description} ${user.category} `;
       listItem.textContent=value;
       listItem.appendChild(editButton);
       listItem.appendChild(deleteButton);
      userList.appendChild(listItem);
      buttonSubmit.innerHTML='Add Expence';
      buttonSubmit.onclick=addexpence;


document.getElementById('money').value='';
document.getElementById('description').value='';
document.getElementById('category').value='';
alert('product updated successfully');

}catch(error){
console.log('error while udpating=',error);
}

}


async function showleaderboard(){
try{
  document.getElementById("leaderboarddata").innerHTML="";
    document.getElementById('leaderboardheading').textContent='Leader Board'
    const response=await axios.get('leaderboard');
  const userdata=response.data;
  const length=response.data.length;
  const ul=document.getElementById("leaderboarddata");
  for(let i=0;i<length;i++){
    const username=userdata[i].name;
    const total_cost=userdata[i].total_expenses;
    const dataformat=`Name-${username} Total Expenses-${total_cost}`
    console.log(dataformat);
    const li=document.createElement('li');
    li.textContent=dataformat;
    ul.appendChild(li);
    
  }


}catch(error){
console.log('something went wrong in showleaderboard=',error);
}
}

}catch(error){
  console.log('error while loading content from server',error);
}

}



document.addEventListener("DOMContentLoaded",fetchexpences);

async function addexpence(type){
//console.log('addexpence function called');

try {
const money=document.getElementById('money').value;
const description=document.getElementById('description').value;
const category=document.getElementById('category').value;
const date=document.getElementById('date').value;
const tokendata=localStorage.getItem('token');
const abc=JSON.parse(tokendata);
const token=abc.tokenid;
const userstatus=abc.ispremiumuser;
const ul=document.getElementById('expencelist');
//console.log('date=',date, 'Moeny=',money, 'description=',description, 'category=',category);
if(money && description && category){
const expencedata={
date:date,
money:money,
description:description,
category:category,
expencetype:type
}
//console.log('form data=',expencedata);
const response=await axios.post('/addexpence',expencedata,{headers:{'Authorization':token}},);
console.log('response data1=',response.data.MESSAGE);
const status=response.data.MESSAGE;
if(status==='success'){
alert('expence created successfully');
const user=response.data.data;
document.getElementById('money').value='';
document.getElementById('description').value='';
document.getElementById('category').value='';
const buttonText=document.getElementById('btn');
      //console.log('id=',user.id);
    const userList = document.getElementById('expencelist');

    // Render each user as a list item
      
      const listItem = document.createElement('li');
        const editButton=document.createElement('button');
        editButton.value='Edit';
        editButton.id=user.id;
        editButton.textContent='Edit';
        editButton.className='editItem';
        editButton.onclick=editItem;
        const deleteButton=document.createElement('button');
        deleteButton.value='delete';
        deleteButton.id=user.id;
        deleteButton.onclick=deleteItem;
        deleteButton.className='deleteItem';
        deleteButton.textContent='Delete';

       const value= `${user.date} ${user.money} ${user.description} ${user.category} `;
       listItem.textContent=value;
       listItem.appendChild(editButton);
       listItem.appendChild(deleteButton);
      userList.appendChild(listItem);
}
}
else{
console.log('something went wrong-',response.data.MESSAGE);
}
} 
   catch (error) {
    alert('internal server error ')
    console.error('Error fetching users:', error.response.data.MESSAGE,' with status code=',error.response.status);
  }


async function editItem(event){

const id=event.target.id;
//console.log('edit item id=',id);
console.log('edit product fun2 called and id is=',event.target.id);

try{
const response=await axios.get(`/editexpence/${id}`);

const user = response.data;
console.log('response=',user);
// Get the <ul> element to append the users
const userList = document.getElementById('expencelist');

// Render each user as a list item

document.getElementById('money').value=user.money;
document.getElementById('description').value=user.description;
document.getElementById('category').value=user.category;
//document.getElementById('userid').value=user.id;
document.getElementById('submit').innerHTML='Update Product';
document.getElementById('submit').onclick=UpdateProduct;
document.getElementById('expenceid').value=user.id;
const li=event.target.parentElement;
console.log('li=',li);
userList.removeChild(li);      
}
catch(error){
console.log('getting error while fetching data from server =',error);

}
}
async function deleteItem(event){
console.log('product deleted  fun1 successfully');
const id=event.target.id;
console.log('value of id=',id);
console.log(`Button ${id} was clicked.`);
try{
const response=await axios.delete(`/deleteexpence/${id}`,{headers:{'Authorization':token}})
console.log('delete response=',response);

if(response){
console.log('User Deleted :',response.data)
const userList = document.getElementById('expencelist');
const li=event.target.parentElement;
console.log(li);

userList.removeChild(li);

}
else{
console.log('something went wrong');
}

}catch(error){
console.log('getting error while fetching data from server =',error);

}

} //delete function closed

async function UpdateProduct(event){

console.log('update product2 function called');
const id=document.getElementById('expenceid').value;
console.log('update expence id=',id);
const money=document.getElementById('money').value;
const description=document.getElementById('description').value;
const category=document.getElementById('category').value;
const buttonSubmit=document.getElementById('submit');
const tokendata=localStorage.getItem('token');
const abc=JSON.parse(tokendata);
const token=abc.tokenid;

const jsonData = {
money: money,
description: description,
category: category,
};

console.log('JSON=',jsonData);
try{
const response=await axios.put(`/updateexpence/${id}`,jsonData,{headers:{'Authorization':token}});
const user=response.data;
console.log('User Updated :',user);

const userList = document.getElementById('expencelist');
    
    // Render each user as a list item
      const listItem = document.createElement('li');
        const editButton=document.createElement('button');
        editButton.value='Edit';
        editButton.id=user.id;
        editButton.textContent='Edit';
        editButton.onclick=editItem;
        const deleteButton=document.createElement('button');
        deleteButton.value='delete';
        deleteButton.id=user.id;
        deleteButton.onclick=deleteItem;
        deleteButton.textContent='Delete';
      document.getElementById('expenceid').value=user.id
       const value= `${user.date} ${user.money} ${user.description} ${user.category} `;
       listItem.textContent=value;
       listItem.appendChild(editButton);
       listItem.appendChild(deleteButton);
      userList.appendChild(listItem);
      buttonSubmit.innerHTML='Add Expence';
      buttonSubmit.onclick=addexpence;


document.getElementById('money').value='';
document.getElementById('description').value='';
document.getElementById('category').value='';
alert('product updated successfully');

}catch(error){
console.log('error while udpating=',error);
}

}
}

async function buypremium(e){
const ispremium=document.getElementById('buypremium').textContent;
const userstatus=abc.ispremiumuser;
console.log('userstatus=',userstatus, 'token=',token);
if(userstatus){
confirm('You are premium user');
}
else{
//e.preventDefault();
const response=await axios.get('buypremium',{headers:{'Authorization':token}});
console.log('RESONSE=',response);
console.log('key_id=',response.data.key_id);
console.log('order id=',response.data.order.id);
var options = {
"key": response.data.key_id, // Enter the Key ID generated from the Dashboard
"name": "ABC CORP",
"description": "Test Transaction",
"image": "https://www.letstrack.com/img/logo.png",
"order_id": response.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
"handler":async function (response){
  alert('Transaction Successfull');
    alert(response.razorpay_payment_id);
    alert(response.razorpay_order_id);
    alert(response.razorpay_signature);
    try{
   const updateresponse= await axios.post('http://127.0.0.1:3000/updatetransactionstatus',{
      order_id:options.order_id,
      payment_id:response.razorpay_payment_id,
      order_status:1
    },{headers:{"Authorization":token}})
    const tokendatalocal=localStorage.getItem('token');
    const parsedToken=JSON.parse(tokendatalocal);
    const id=parsedToken.tokenid;
    const data={
      tokenid:id,
      ispremiumuser:true
    }
    const stringifyData=JSON.stringify(data);
    localStorage.setItem("token",stringifyData);
    console.log('STATUS=',updateresponse.data.MESSAGE);

    alert('you are a premium user now');
    location.reload();        

}

catch(error){
  console.log('error while updating transaction status=',error);
}
},
};
var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', async (response)=>{
    console.log('failed response=',response);
    try{
    const updateresponse= await axios.post('http://127.0.0.1:3000/updatetransactionstatus',{
      order_id:options.order_id,
      payment_id:0,
      order_status:0
    },{headers:{"Authorization":token}})
    console.log('failed order response=',updateresponse.data.MESSAGE);
    const tokendata=localStorage.getItem('token');
    const data={
      tokenid:tokendata.tokenid,
      ispremiumuser:false
    }
    localStorage.setItem('token',data);
    alert('TRANSACTION FAILED');
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
    location.reload();


  }catch(error){
    console.log('error=',error);
  }
  });

console.log('razorpay fun is called');
rzp1.open();

}
}

const monthlybutton=document.getElementById("Monthly");

async function monthlyreport(){
//alert('button clicked');
document.getElementById("monthlysummary").innerHTML="";
document.getElementById("monthlyheading").innerHTML="";
const userstatus=abc.ispremiumuser;
if(userstatus){
document.getElementById("monthlyTitle").textContent="Monthly Report"

try{
const response= await axios.get('monthlysummary',{headers:{'Authorization':token}})
const arr=response.data.DATA;
console.log('response=',arr);
let table = document.getElementById("monthlysummary");
let expencesTotal=0;
let incomeTotal=0;
let throwid = document.getElementById("monthlyheading");

const rowheading=document.createElement("tr");
let c1h = document.createElement("th")
let c2h = document.createElement("th")
let c3h = document.createElement("th")
let c4h = document.createElement("th")
let c5h = document.createElement("th")


// Insert data to cells
c1h.innerText ='YEAR';
c2h.innerText = 'MONTH';
c3h.innerText = 'INCOME'
c4h.innerText = 'EXPENCES';
c5h.innerText = 'SAVINGS';

rowheading.appendChild(c1h);
rowheading.appendChild(c2h);
rowheading.appendChild(c3h);
rowheading.appendChild(c4h);
rowheading.appendChild(c5h);

throwid.appendChild(rowheading)
// Append row to table body

for(let i=0;i<arr.length;i++){
console.log(arr[i].YEAR,arr[i].MONTH,arr[i].INCOME,arr[i].EXPENCES);

let row = document.createElement("tr")

// Create cells
let c1 = document.createElement("td")
let c2 = document.createElement("td")
let c3 = document.createElement("td")
let c4 = document.createElement("td")
let c5 = document.createElement("td")


// Insert data to cells
c1.innerText =arr[i].YEAR;
c2.innerText = arr[i].MONTH;
c3.innerText = arr[i].INCOME
c4.innerText = arr[i].EXPENCES;
c5.innerText = arr[i].INCOME-arr[i].EXPENCES;
incomeTotal+=arr[i].INCOME;
expencesTotal+=arr[i].EXPENCES;


row.appendChild(c1);
row.appendChild(c2);
row.appendChild(c3);
row.appendChild(c4);
row.appendChild(c5);

// Append row to table body
table.appendChild(row)

}

let rowByDate = document.createElement("tr")

// Create cells
let c1 = document.createElement("td")
let c2 = document.createElement("td")
let c3 = document.createElement("td")
c3.className="text-success";
let c4 = document.createElement("td")
c4.className="text-danger";
let c5 = document.createElement("td")
c5.className="text-primary";


// Insert data to cells
c1.innerText ="";
c2.innerText = "";
c3.innerText = '₹'+incomeTotal
c4.innerText = '₹'+expencesTotal;
c5.innerText ='₹'+(incomeTotal-expencesTotal);

rowByDate.appendChild(c1);
rowByDate.appendChild(c2);
rowByDate.appendChild(c3);
rowByDate.appendChild(c4);
rowByDate.appendChild(c5);

rowByDate.className="table-success"
// Append row to table body
table.appendChild(rowByDate)

}
catch(error){
console.log('getting error=',error);
}

}
else{
alert('Unauthorised access- Please subscribe');
}
}

//yearly report function
async function yearlyreport(){
    //alert('button clicked');
  
    document.getElementById("yearlysummary").innerHTML="";
    document.getElementById("yearlyheading").innerHTML="";
    const userstatus=abc.ispremiumuser;
    if(userstatus){
    document.getElementById("yearlyTitle").textContent="Yearly Report"
  
  try{
  const response= await axios.get('yearlysummary',{headers:{'Authorization':token}})
  const arr=response.data.DATA;
  console.log('response=',arr);
  let table = document.getElementById("yearlysummary");
    let expencesTotal=0.00;
    let incomeTotal=0.00;
    let throwid = document.getElementById("yearlyheading");
  
    const rowheading=document.createElement("tr");
     let c1h = document.createElement("th")
     let c3h = document.createElement("th")
     let c4h = document.createElement("th")
     let c5h = document.createElement("th")
  
     
     // Insert data to cells
     c1h.innerText ='YEAR';
     c3h.innerText = 'INCOME'
     c4h.innerText = 'EXPENCES';
     c5h.innerText = 'SAVINGS';
    
     rowheading.appendChild(c1h);
     rowheading.appendChild(c3h);
     rowheading.appendChild(c4h);
     rowheading.appendChild(c5h);
   
    throwid.appendChild(rowheading)
     // Append row to table body
     
  for(let i=0;i<arr.length;i++){
    console.log(arr[i].YEAR,arr[i].INCOME,arr[i].EXPENCES);
  
     let row = document.createElement("tr")
     
     // Create cells
     let c1 = document.createElement("td")
     let c3 = document.createElement("td")
     let c4 = document.createElement("td")
     let c5 = document.createElement("td")
  
     
     // Insert data to cells
     c1.innerText =arr[i].YEAR;
     c3.innerText = arr[i].INCOME
     console.log('typeOf=',typeof incomeTotal);
    c4.innerText = arr[i].EXPENCES;
    c5.innerText = arr[i].INCOME-arr[i].EXPENCES;
    incomeTotal+=Number(arr[i].INCOME);
    expencesTotal+=Number(arr[i].EXPENCES);
  
    console.log('EXPENCES TOTAL=',expencesTotal,' INCOME TOTAL=',incomeTotal);
     
    row.appendChild(c1);
     row.appendChild(c3);
     row.appendChild(c4);
     row.appendChild(c5);
    
     // Append row to table body
     table.appendChild(row)
  
    }
    
  
  let rowByDate = document.createElement("tr")
     
     // Create cells
     let c1 = document.createElement("td")
     let c3 = document.createElement("td")
     c3.className="text-success";
     let c4 = document.createElement("td")
     c4.className="text-danger";
     let c5 = document.createElement("td")
     c5.className="text-primary";
     
     
     // Insert data to cells
     c1.innerText ="";
     c3.innerText = '₹'+incomeTotal
     c4.innerText = '₹'+expencesTotal;
     c5.innerText ='₹'+(incomeTotal-expencesTotal);
     
     rowByDate.appendChild(c1);
     rowByDate.appendChild(c3);
     rowByDate.appendChild(c4);
     rowByDate.appendChild(c5);
    
     rowByDate.className="table-success"
     // Append row to table body
     table.appendChild(rowByDate)
  
    }
  catch(error){
    console.log('getting error=',error);
  }
  
  }
  else{
    alert('Unauthorised access- Please subscribe');
  }
}

async function downloadreport(){

    try{
          const response=await axios.get("download",{headers:{'Authorization':token}})
          console.log('response=',response);
          if(response.status===200){
  //          alert('success');
            window.open(response.data.fileUrl);
          }
          
    }
   catch(error){
  
    if(error.response.status===500){
            alert("Internal server error");
      }
    else{      
    console.log('something went wrong=',error);
    alert('Unauthorised access');
    }
   }
  }

  async function pagination(pagenumber,buttontype){    

    const perPageData=localStorage.getItem("perPageData");

    try{
      const response=await axios.get(`items?page=${pagenumber}`,{headers:{'Authorization':token,'perPageData':perPageData}})
      console.log('response=',response.data);
      const user=response.data.userdata;
      let currentPage=response.data.currentPage;
      const totalItems=response.data.totalItems;
      const totalPages=response.data.totalPages;
      const previousPage=response.data.previousPage;
      const nextPage=response.data.nextPage;
      const datalength=response.data.userdata.length;
      const date=response.data.uniqueDate;
      document.getElementById('tableBody').innerHTML=""

  let table = document.getElementById("tableBody");
  let expencesTotal=0;
  let incomeTotal=0;

      // Render each user as a list item
        for(let j=0;j<date.length;j++){
          let userstatus=false;
          let expencesTotalByDate=0;
           let  incomeTotalByDate=0;
  
          for(let i=0;i<user.length;i++){
  
          if(date[j]==user[i].date){
            //console.log('true');
            userstatus=true;
        
          const value= `${user[i].date} ${user[i].money} ${user[i].description} ${user[i].category} `;
          //console.log('format=',value);
      
  let row = document.createElement("tr")
  
  // Create cells
  let c1 = document.createElement("td")
  let c2 = document.createElement("td")
  let c3 = document.createElement("td")
  let c4 = document.createElement("td")
  let c5=  document.createElement("td")
  
  // Insert data to cells
  c1.innerText =user[i].date;
  c2.innerText = user[i].description;
  c3.innerText = user[i].category
  
  // Append cells to row
  
  if(user[i].type===1){
  c4.innerText = user[i].money;
  incomeTotalByDate+=user[i].money;
  incomeTotal+=user[i].money;
  }
  if(user[i].type===2){
  c5.innerText = user[i].money;
  expencesTotalByDate+=user[i].money;
  expencesTotal+=user[i].money;
  }
  
  row.appendChild(c1);
  row.appendChild(c2);
  row.appendChild(c3);
  row.appendChild(c4);
  row.appendChild(c5);
  // Append row to table body
  table.appendChild(row)
  
  }
  
  }
  if(userstatus){
  let rowByDate = document.createElement("tr")
  
  // Create cells
  let c1 = document.createElement("td")
  let c2 = document.createElement("td")
  let c3 = document.createElement("td")
  let c4 = document.createElement("td")
  let c5= document.createElement("td")
  
  // Insert data to cells
  c1.innerText ="";
  c2.innerText = "";
  c3.innerText = ""
  c4.innerText = incomeTotalByDate;
  c5.innerText = expencesTotalByDate
  
  
  rowByDate.appendChild(c1);
  rowByDate.appendChild(c2);
  rowByDate.appendChild(c3);
  rowByDate.appendChild(c4);
  rowByDate.appendChild(c5);
  rowByDate.className="table-success"
  // Append row to table body
  table.appendChild(rowByDate)
  
  }
  }
  /*if(currentPage==totalPages){
  let finalrow = document.createElement("tr")
  
  // Create cells
  let c1 = document.createElement("td")
  let c2 = document.createElement("td")
  let c3 = document.createElement("td")
  let c4 = document.createElement("td")
  c4.className="text-success";
  let c5= document.createElement("td")
  c5.className="text-danger";
  
  // Insert data to cells
  c1.innerText ="";
  c2.innerText = "";
  c3.innerText = ""
  c4.innerText = '₹'+incomeTotal;
  c5.innerText = '₹'+expencesTotal
  
  
  finalrow.appendChild(c1);
  finalrow.appendChild(c2);
  finalrow.appendChild(c3);
  finalrow.appendChild(c4);
  
  finalrow.appendChild(c5);
  finalrow.className="table-success"
  // Append row to table body
  table.appendChild(finalrow)
  
  
  let summaryrow = document.createElement("tr")
  
  // Create cells
  let cf1 = document.createElement("td")
  let cf2 = document.createElement("td")
  let cf3 = document.createElement("td")
  let cf4 = document.createElement("td")
  cf4.className="text-primary";
  let cf5= document.createElement("td")
  cf5.className="text-primary";
  
  // Insert data to cells
  cf1.innerText ="";
  cf2.innerText = "";
  cf3.innerText = ""
  if(incomeTotal>=expencesTotal){
  cf4.innerText = "Savings INR";
  cf5.innerText ='₹'+(incomeTotal-expencesTotal);
  }
  
  else{
  cf4.innerText = "Expences INR";
  cf5.innerText = '₹'+(expencesTotal-incomeTotal);
  }
  
  summaryrow.appendChild(cf1);
  summaryrow.appendChild(cf2);
  summaryrow.appendChild(cf3);
  summaryrow.appendChild(cf4);
  summaryrow.appendChild(cf5);
  summaryrow.className="table-success"
  // Append row to table body
  table.appendChild(summaryrow)  
  
  }
*/
  pagination_number_div.innerHTML=""

  if(buttontype=="pre"){
//    alert(pagenumber);
    const button1=document.createElement("button");
      button1.className="btn btn-primary"
      button1.id="pre-btn"
    const button2=document.createElement("button");
      button2.className="btn btn-primary"
      button2.id="next-btn"

    if(Number(pagenumber)==1){
      button1.innerHTML=Number(pagenumber);
      button2.innerHTML=Number(pagenumber)+1;
    }  
    else{
      button1.innerHTML=Number(pagenumber)-1;
      button2.innerHTML=Number(pagenumber);
    }  
      pagination_number_div.appendChild(button1);
      pagination_number_div.appendChild(button2);

      document.getElementById('pre-btn').addEventListener("click",()=>{
        if(Number(pagenumber)>1){
          console.log('pagination3 fun pre');
          currentPage--;
        pagination(Number(currentPage),"pre");
        }
      })
      
      document.getElementById("next-btn").addEventListener("click",()=>{
          if(Number(pagenumber)<Number(totalPages)){
            console.log('pagniation3 fun next');
          currentPage++;
          pagination(Number(currentPage),"next");
          }
        })     
  }

  if(buttontype=="next" && Number(pagenumber)<Number(totalPages)){
    console.log('next'); 
      const button1=document.createElement("button");
      button1.innerHTML=Number(pagenumber);
      button1.className="btn btn-primary"
      button1.id="pre-btn"

      const button2=document.createElement("button");
      button2.innerHTML=Number(pagenumber)+1;
      button2.className="btn btn-primary"
      button2.id="next-btn",
      
      pagination_number_div.appendChild(button1);
      pagination_number_div.appendChild(button2);
      
      document.getElementById('pre-btn').addEventListener("click",()=>{
        if(currentPage>1){
          console.log('pagination fun pre');
          currentPage--;
        pagination(Number(currentPage),"pre");
        }
      })
      
      document.getElementById("next-btn").addEventListener("click",()=>{
        if(Number(currentPage)<=Number(totalPages)){
          console.log('pagniation fun next');
        currentPage++;
        pagination(Number(currentPage),"next");
        }
      })
      
  }

  if(buttontype=="next" && Number(pagenumber)==Number(totalPages)){
    console.log('next2'); 
      const button1=document.createElement("button");
      button1.innerHTML=Number(pagenumber)-1;
      button1.className="btn btn-primary"
      button1.id="pre-btn"

      const button2=document.createElement("button");
      button2.innerHTML=Number(pagenumber);
      button2.className="btn btn-primary"
      button2.id="next-btn",
      
      pagination_number_div.appendChild(button1);
      pagination_number_div.appendChild(button2);
      
      document.getElementById('pre-btn').addEventListener("click",()=>{
        if(currentPage>1){
          console.log('pagination2 fun pre');
          currentPage--;
        pagination(Number(currentPage),"pre");
        }
      })
      
      document.getElementById("next-btn").addEventListener("click",()=>{
        if(Number(currentPage)==Number(totalPages)){
          console.log('pagniation2 fun next');
        }
      })
      
  }
  
  }

    catch(error){
      console.log('something went wrong=',error);
    }
  }
  
const dropdown=document.getElementById("dropdown");
  dropdown.addEventListener("change",dropdownlist);

  function dropdownlist(){
    console.log('e=',this);
    alert(this.value);
    localStorage.setItem('perPageData',this.value)
  }