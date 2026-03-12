import express from "express";
import { createUser,  deleteUsers,  editOwnDetails,  editUsers,  getUsers, loginUser } from "../controllers/userController.js";
import User from "../models/users.js";

const userRouter = express.Router();



userRouter.post("/",createUser);
userRouter.get("/",getUsers);
userRouter.post("/login",loginUser);
userRouter.delete("/:userId", deleteUsers);
userRouter.put("/:userId",editUsers);   //Admin only
userRouter.put("/:userId/me", editOwnDetails); //self edit


export default userRouter;