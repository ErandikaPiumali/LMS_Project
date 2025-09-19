import express  from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import dotenv from "dotenv";
dotenv.config()

 

const app = express ();

app.use(bodyParser.json())




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





   











