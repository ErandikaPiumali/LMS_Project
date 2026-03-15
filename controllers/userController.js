import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateId, rolePrefixes } from "../utils/generateIDs.js";
import { isAdmin, isVerifiedUser } from "../middleware/authMiddleware.js";
dotenv.config();


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
      "role","guardianName","classLevel","address","guardianPhoneNo","guardianType"
    ];

    const userData ={};
    allowedFields.forEach(field => {
        if(req.body[field]!== undefined) {
            userData[field]=req.body[field];
      } 
    });

userData.role = userData.role || "Student";
    userData.password = passwordHash;

    const prefix = rolePrefixes[userData.role];
    userData.userId = await generateId(User, prefix);

    const user = new User(userData);
    const savedUser = await user.save();
res.json({
				message: "User with UserID " + userData.userId +" created successfully",
        savedUser
			});
		
		} 

    catch(error)  {
      console.error("Error creating User", error);
			res.status(400).json({
				message: "Failed to create user",
        error:error.message,
			});
		}
  }




  export function loginUser(req,res){
 
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
      message : "User not Found"
    })
      //  Password expiration check
    const PASSWORD_EXPIRATION_DAYS = 90;
    const now = new Date();
    const passwordAgeDays = (now - User.passwordLastUpdated) / (1000 * 60 * 60 * 24);

    if (passwordAgeDays > PASSWORD_EXPIRATION_DAYS) {
      return res.status(403).json({
        message: "Your password has expired. Please update your password before logging in."
      });
    }
  
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
  
 
  
 export async function getUsers(req,res){
    try{

       if (!isAdmin(req)) {
        return res.status(403).json({
          message:"Access denied.Admin only!!!"
        })
      }

  const{userId, role, isBlocked} = req.query;
  const filter={};

  if(userId) filter.userId = userId;
  if(role)   filter.role =role;
  if (isBlocked === "true") filter.isBlocked = true;
  if (isBlocked === "false") filter.isBlocked = false;

  const users = await User.find(filter).select("-password"); // filter details without password

   if (!users || users.length === 0) {
      return res.status(404).json({
        message:"No users found "
      });
    }

  return res.json(users);
} 

 catch(error){
      console.log("Error fetching users : ", error);
      return res.status(500).json({
        message:"Failed to find users",
        error:error.message
      })
    }
  }

 

  export async function deleteUsers(req,res){
    
        if (!isAdmin(req)) {
         res.status(403).json({
          message:"Access denied.Admin only!!!"
        })
        return;
      }

      try{
      const userId = req.params.userId;
     const result = await User.deleteOne({
        userId 
      })
        if (result.deletedCount === 0) {
      return res.status(404).json({
        message: `User ${userId} not found.`
      });
    }
      
       res.status(200).json({
         message: `User ${userId} deleted successfully.` })
      } catch (error) {
        console.error("Error deleting User; ",error);
        res.status(500).json({
           message: "Failed to delete user.",
          error:error.message });
        return;
    }


    }

  
  export async function editUsers(req,res){
    if(!isAdmin(req)){
      res.status(403).json({
        message:"Access denied.Admin only!!!"
      })
      return;
    }
    try{
      const userId= req.params.userId;

      const allowedFields = [
      "firstName",
      "lastName",
      "gender",
      "email",
      "phoneNo",
      "role",
      "guardianName",
      "classLevel",
      "guardianPhoneNo",
      "address",
      "guardianType",
      "isBlocked",
      "isEmailVerified"
    ];

    const updatedData = {};
    allowedFields.forEach (findFields=>{
      if( req.body[findFields] !== undefined){
        updatedData[findFields] = req.body[findFields]
      }
    })
    if (req.body.password) {
      updatedData.password = bcrypt.hashSync(req.body.password, 10);

    }
     const updatedUser = await User.findOneAndUpdate(
      { userId },
      updatedData,
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    return res.json({
      message: `User ${userId} updated successfully`,updatedUser
      
    });

  }catch(error){
return res.status(500).json({
  message : "Failed to update user ",
   error:error.message
})
  }

    }
    
    //edit own user details - other users
export async function editOwnDetails(req,res){
  if(!isVerifiedUser(req)){
      res.status(403).json({
        message:"You are not verified User!!!"
      })
      return;
    }
       try{
      const userId= req.params.userId;

      const allowedUserFields = [
      "email",
      "phoneNo",
      "guardianPhoneNo",
      "address",
    ];
    const updatedData = {};

    allowedUserFields.forEach (findUserFields=>{
      if( req.body[findUserFields] !== undefined){
        updatedData[findUserFields] = req.body[findUserFields]
      }
    })

    if (req.body.password) {
      updatedData.password = bcrypt.hashSync(req.body.password, 10);
       updatedData.passwordLastUpdated = new Date(); 

    }
      const updatedUser = await User.findOneAndUpdate(
      { userId },
      updatedData,
      { new: true }
    ).select("-password");

    return res.json({
      message: `Your account has been updated successfully`,
      updatedUser
    });

  } catch (error) {
    console.error("Error updating your account:", error);
    return res.status(500).json({
       message: "Failed to update your account",
       error: error.message });
  }
}

    


  
    


  
