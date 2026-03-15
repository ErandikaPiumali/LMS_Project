import { isAdmin} from "../middleware/authMiddleware.js";
import Courses from "../models/courses.js";
import { collectionPrefixes, generateId } from "../utils/generateIDs.js";

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

export async function getCoursesById(req,res){
// filter courseIds and give details 
//give all details if enrolled

}


