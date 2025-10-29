import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


 export async function createUser(req,res){
  try{

    const passwordHash = bcrypt.hashSync(req.body.password,10);

       const allowedFields = [
      "firstName","lastName","gender","email","phoneNo",
      "role","guardianName","classLevel","parentPhoneNo","address"
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
    res.status(404).json({
      message : "User not Found",
    }); 
   
 
 }else {
    const isPasswordCorrect= bcrypt.compareSync(password, User.password);
    if(isPasswordCorrect){
      res.json({
        message:"Login successful"
      });

      }else{ 
        res.status(403).json({
          message:"Incorrect Password"
        });
      }
    }
  } )
}
  
 

  
  



 


 
  export async function getUser(req,res){
     if(req.user == null){
        res.status(404).json({
            message : "User not found",
           

        });
     } else{
        console.log(req.user);
        res.json(req.body);
     }
    }

    


  
