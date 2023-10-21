const AWS=require('aws-sdk');

const uplaodtoS3=(data,filename)=>{

    const BUCKET_NAME='myexpencebucket';
    const IAM_USER_ACCESS_KEY='AKIAZEJARKVDEBCSNLEM'
    const IM_USER_SECRET_KEY='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';
  
    let s3bucket=new AWS.S3({
      accessKeyId:IAM_USER_ACCESS_KEY,
      secretAccessKey:IM_USER_SECRET_KEY,
     // Bucket:BUCKET_NAME
    })
    
      const params={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
      }
  
      return new Promise((resolve,reject)=>{
        
      s3bucket.upload(params,(err,response)=>{
        if(err){
          console.log('something went wrong=',err);
          reject(err);
        }
        else{
          console.log('success=',response.Location);
        resolve(response.Location);
        }
        })
    
      })  
    
  }

  module.exports={
    uplaodtoS3
  }