import express from "express";
import { createCourse, getCourses } from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.post("/",createCourse);
courseRouter.get("/",getCourses);

export default courseRouter;