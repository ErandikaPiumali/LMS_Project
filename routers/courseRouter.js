import express from "express";
import { createCourse } from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.post("/",createCourse);

export default courseRouter;