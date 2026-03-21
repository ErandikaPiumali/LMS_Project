import express from "express";
import { createCourse, deleteCourse, getCourses, getCoursesById, updateCourse } from "../controllers/courseController.js";
import { createSections } from "../controllers/sectionController.js";

const courseRouter = express.Router();

courseRouter.post("/",createCourse);
courseRouter.get("/",getCourses);
courseRouter.delete("/:courseId",deleteCourse);
courseRouter.get("/:courseId",getCoursesById);
courseRouter.put("/:courseId",updateCourse);
courseRouter.post("/:courseId/sections",createSections);


export default courseRouter;