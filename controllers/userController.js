import User from "../models/users.js";
import bcrypt from "bcrypt";


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



