import express  from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import dotenv from "dotenv";

import courseRouter from "./routers/courseRouter.js";
import { verifyToken } from "./middleware/authMiddleware.js";
dotenv.config()

 

const app = express ();

//Middleware
app.use(bodyParser.json())



//tokenVerified
app.use(verifyToken);

   

      
//Routers
app.use("/api/users",userRouter);
app.use("/api/courses",courseRouter);



//Database and Server
const connectionString = process.env.MONGO_URI

mongoose.connect(connectionString).then(
    ()=>{
  console.log("Database connected");
}).catch(()=>{
  console.log("Failed to connect Database");
})

app.listen(5000,()=>{
    console.log("Server is running on port 5000")
})







   











