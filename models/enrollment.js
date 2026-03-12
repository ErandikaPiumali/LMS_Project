import mongoose from "mongoose";
const enrollmentSchema =new mongoose.Schema(
    {

    enrollmentId:{
        type:String,
        unique:true,
        immutable:true
    },

    studentId:{
        type:String,
        ref:"users",
        required:true
    },

    enrolledAt:{
type:Date,
default:Date.now

    },
    courseId:{
        type:String,
        ref:"courses",
        required:true
    },
    enrollmentStatus:{
        type:String,
        enum:[
            "Active", "Cancelled", "Pending", "Expired"
        ],
        default:"Pending"
    },
   
    
    },
     {timestamps:true}

);

enrollmentSchema.index(
    {studentId:1,courseId:1},
    {unique:true}
);
 
const Enrollment =mongoose.model("enrollments",enrollmentSchema);
export default Enrollment;
