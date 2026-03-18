import { isAdmin, isTeacher} from "../middleware/authMiddleware.js";
import Courses from "../models/courses.js";
import { collectionPrefixes, generateId } from "../utils/generateIDs.js";
import User from "../models/users.js";

export async function createCourse(req,res){

    if(!isAdmin(req)){
return res.status(403).json({
    message:"Please login as Admin to create courses"
}) 


    }
    try{
        const allowedCourseFields=[
            "courseTitle",
            "subject",
            "courseDescription",
            "classLevel",
            "teacherId",
            "assistantId",
            "courseFee",
            "courseImage",
            "mode",
            "maxStudents",
            "tags"
        ]

        const courseData ={};
        allowedCourseFields.forEach((field)=>{

            if(req.body[field]!== undefined){
                courseData[field]=req.body[field]
            }
        }
    );

    courseData.courseId=await generateId(Courses,collectionPrefixes.Course);

      const course =new Courses(courseData);
        const savedCourse =await course.save()
        res.status(201).json({
            message:"Course "+ courseData.courseId +" created successfully",
            courses:savedCourse
        });


    }
    catch(error){
        console.error("Error creating course: ",error)
        return res.status(400).json({
            message:"Failed to create a course",
            error:error.message
        })

    }
}



export async function getCourses(req,res) {

try{
    const {subject,classLevel,courseStatus,mode,teacherId,teacherName}=req.query;
    let filter={};
   
    if (!isAdmin(req)){

   filter.courseStatus = "Published";
   if (teacherName) {                 
    const teacher = await User.findOne({
      firstName: { $regex: teacherName, $options: "i" },
      role: "Teacher"
    });
    if (teacher) filter.teacherId = teacher.userId;
    }
}

   else{
     if (courseStatus) filter.courseStatus = courseStatus;
   if (teacherId) filter.teacherId = teacherId; 
  }

if(subject) filter.subject =subject;
if(classLevel) filter.classLevel=classLevel;
if(mode) filter.mode=mode;

const courses = await Courses.find(filter);

if(!courses||courses.length===0){
    return res.status(404).json({
       message: "No courses found"
    });
}

return res.json(courses);

}
    
catch(error){
    console.error("Error fetching course details",error);
    return res.status(500).json({
        message:"Failed to fetch courses"
       
    });

}
}



export async function deleteCourse(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message:"Access denied. Admin only"
        })
        return;
    }
   try {
    const courseId=req.params.courseId;
    const result=await Courses.deleteOne({
        courseId:courseId
    })
      if (result.deletedCount === 0) {
      return res.status(404).json({
        message: `Course ${courseId} not found`
      });
    }

    res.json({
        message:"Course deleted successfully"
    })

    }
    catch(error){
        console.error("Error deleting course",error)
        res.status(500).json({
            message:"Failed to delete course"
        })
        return;

    }
}



export async function getCoursesById(){

// filter courseIds and give details 
//give all details if enrolled

}


export async function updateCourse(req, res) {
  try {
    const { courseId } = req.params;

    
    const course = await Courses.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updateData = {};

    if (isTeacher(req)) {
     
      if (course.teacherId !== req.User.userId) {
        return res.status(403).json({ message: "You are not allowed to update this course" });
      }

      
      const teacherFields = [
        "courseDescription", "maxStudents", "courseFee",
        "courseImage", "classTime", "mode", "tags", "assistantId"
      ];
      teacherFields.forEach(field => {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
      });

    } else if (isAdmin(req)) {
      
      const adminFields = [
        "courseDescription", "maxStudents", "courseFee", "courseImage",
        "classTime", "mode", "tags", "assistantId", "classLevel",
        "courseStatus", "teacherId"
      ];
      adminFields.forEach(field => {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
      });

      
      if (course.courseStatus === "Draft") {
       
        if (req.body.courseTitle) updateData.courseTitle = req.body.courseTitle;
        if (req.body.subject) updateData.subject = req.body.subject;
      }

     else {
      if(req.body.courseTitle||req.body.subject){
        return res.status(400).json({
          message:"Update Unsuccessful"
        });
      }
    }
  }else{
      return res.status(403).json({ message: "You are not allowed to update courses" });
    }

    
    const updatedCourse = await Courses.findOneAndUpdate(
      { courseId },
      updateData,
      { new: true }
    );

    return res.json({
      message: `Course ${courseId} updated successfully`,
      updatedCourse
    });

  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({ message: "Failed to update course" });
  }
}


