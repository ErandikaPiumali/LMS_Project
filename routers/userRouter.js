import express from "express";
import { createUser,  deleteUsers,  getUsers, loginUser } from "../controllers/userController.js";
import User from "../models/users.js";

const userRouter = express.Router();



userRouter.post("/",createUser);
userRouter.get("/",getUsers);
userRouter.post("/login",loginUser);
userRouter.delete("/:userId", deleteUsers);

export default userRouter;