import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


//Is Admin?
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


//Create users - only admin
 export async function createUser(req,res){

if(!isAdmin(req)){
  return res.status(403).json({
    message:"Please login as admin to create users"
  })
  
} 
  try{

    const passwordHash = bcrypt.hashSync(req.body.password,10);

       const allowedFields = [
      "firstName","lastName","gender","email","phoneNo",
      "role","guardianName","classLevel","guardinPhoneNo","address","guardianPhoneNo","guardianType"
    ];

    const userData ={};
    allowedFields.forEach(field => {
        if(req.body[field]!== undefined) {
            userData[field]=req.body[field];
      } 
    });

userData.role = userData.role || "Student";
    userData.password = passwordHash;

  const rolePrefixes = {
  Student: "ST",
  Teacher: "TC",
  Admin: "AD",
  "Payment Manager": "PM",
  Assistant: "AS"
};

    const count = await User.countDocuments();
    
    const fullYear= new Date().getFullYear();
    const year = fullYear.toString().slice(-2);

    const prefix = rolePrefixes[userData.role] 
   userData.userId = `${prefix}${year}-${(count + 1).toString().padStart(4, "0")}`;


    const user = new User(userData);

		 const savedUser = await user.save();

		
			res.json({
				message: "User with UserID " + userData.userId +" created successfully",
        savedUser
			});
		
		} 
    catch(e)  {
      console.error("Error creating User", e);
			res.status(400).json({
				message: "Failed to create user",
        error:e.message,
			});
		}
  }



// Users login
  export function loginUser(req,res){
 // in request body - Email and Password
 const email = req.body.email;
 const password = req.body.password;

 User.findOne(
  {email:email}
 )
 .then (
  (User)=>{
   
  if (User == null){
    res.status(404).json
    ({
      message : "User not Found",
    })
  
  return;
   
 
 }else {
    const isPasswordCorrect= bcrypt.compareSync(password, User.password);

    if(isPasswordCorrect){
     const token = jwt.sign(
     {
      email:User.email,
     firstName : User.firstName,
      lastName : User.lastName,
      role:User.role,
      isBlocked:User.isBlocked,
      isEmailVerified:User.isEmailVerified
      
     },
     process.env.JWT_SECRET,
  { expiresIn: "1h" },
 )
  
  res.json({
    token:token,
    message:"Login Successful"
  })
      }else
        res.status(403).json({
          message:"Incorrect password"
        })
    }
  } )
}
  
 
  // View users- only admin- filter
 export async function getUsers(req,res){
    try{

       if (!isAdmin(req)) {
        return res.status(403).json({
          message:"Access denied.Admin only!!!"
        })
      }

      const{userId, role, isBlocked} = req.query;

      const filter={};
      if(userId)filter.userId = userId;
      if(role)filter.role =role;
  if (isBlocked === "true") filter.isBlocked = true;
  if (isBlocked === "false") filter.isBlocked = false;

  const users = await User.find(filter).select("-password"); // filter details without password

  return res.json(users);
} 
 catch(error){
      console.log("Error fetching users : ", error);
      return res.status(500).json({
        message:"Failed to fetch users"
      })
    }
  }

  //Delete users
  export async function deleteUsers(req,res){
    
        if (!isAdmin(req)) {
         res.status(403).json({
          message:"Access denied.Admin only!!!"
        })
        return;
      }
      try{
      const userId = req.params.userId;
      await User.deleteOne({
        userId : userId,
      })
      
       res.status(200).json({
         message: `User ${userId} deleted successfully.` })
      } catch (error) {
        console.error("Error deleting User; ",error);
        res.status(500).json({ message: "Failed to delete user." });
        return;
    }


    }

  
    


  
