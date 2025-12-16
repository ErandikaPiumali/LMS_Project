import express  from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config()

 

const app = express ();

app.use(bodyParser.json())

app.use(
(req,res,next)=>{
  const value=req.header("Authorization")
  if(value!=null){
  //to remove bearer text part
  const token = value.replace("Bearer ","")
 

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err,decoded)=>{
      if(decoded==null){
        res.status(403).json({
          message:"Unauthorized"
        })
      }else{
        req.User=decoded
      }
      
    }
  )
 
  }
  next()
}
)




const connectionString = process.env.MONGO_URI

mongoose.connect(connectionString).then(
    ()=>{
  console.log("Database connected");
}).catch(()=>{
  console.log("Failed to connect Database");
})



        

app.use("/users",userRouter)


app.listen(5000,()=>{
    console.log("Server is running on port 5000")
})







   











