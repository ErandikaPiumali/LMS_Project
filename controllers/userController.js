import User from "../models/users.js";
import bcrypt from "bcrypt";


 export  function createUser(req,res){
    const passwordHash = bcrypt.hashSync(req.body.password,10);

    const allowedFields = [
      "firstName","lastName","userName","gender","email","phoneNo",
      "role","guardianName","classLevel","schoolName","parentEmail","parentPhoneNo","address"
    ];

    const userData ={};
    allowedFields.forEach(field => {
        if(req.body[field]!== undefined) 
            userData[field]=req.body[field];
        
    });

userData.role = userData.role || "Student";
    userData.password = passwordHash;


    const user = new User(userData);

		user.save()
		.then(() => {
			res.json({
				message: "User created successfully",
			});
		})
		.catch(() => {
			res.json({
				message: "Failed to create user",
			});
		});
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



