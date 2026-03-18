import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function verifyToken(req, res, next){
  const value=req.header("Authorization")
  
    if(value!=null){
  
    const token = value.replace("Bearer ","")
   
  
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err,decoded)=>{
        
        if(err||decoded==null){
  
      return   res.status(403).json({
            message:"Unauthorized"
          })
        }
          req.User=decoded;
           next();
  
        }
        
      
    );
   
    }else{
      next();
    }
   
  }
  



export function isAdmin(req){
  if(req.User == null){
    return false;
  }
  if(req.User.role =="Admin"){
    return true;
  }else{
    return false;
  }
}

export function isTeacher(req){
    if(req.User==null){
        return false;
    }
    if(req.User.role=="Teacher"){
        return true;
    }else{
        return false;
    }

}

export function isAssistant(req){
    if(req.User==null){
        return false;
    }
    if(req.User.role=="Assistant"){
        return true;
    }else{
        return false;
    }

}


export function isVerifiedUser(req){
  if(!req.User){
    return false;
  }
  if(req.User.isEmailVerified && 
    !req.User.isBlocked  && 
     req.User.userId==req.params.userId){
    return true;
  }else{
    return false;
  }
}

