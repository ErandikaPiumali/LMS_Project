import express from "express";
import { createCourse, getCourses, getCoursesById, updateCourse } from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.post("/",createCourse);
courseRouter.get("/",getCourses);
courseRouter.get("/:courseId",getCoursesById);
courseRouter.put("/:courseId",updateCourse);

export default courseRouter;