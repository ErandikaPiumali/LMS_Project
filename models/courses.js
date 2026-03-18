import mongoose from "mongoose";
import { CLASS_LEVELS, SUBJECTS } from "../utils/modelSchemas.js";

const coursesSchema = new mongoose.Schema({
  courseId:{
    type:String,
    unique:true,
    immutable:true,
    required:true


  },

   courseTitle:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },

  subject:{
    type:String,
    enum:SUBJECTS,
    required:true

  },

  courseDescription:{
    type:String,
    trim:true
  },

  classLevel:{
    type:String,
    enum:CLASS_LEVELS,
    required:true
  },
  maxStudents:{
type:Number,
min:1
  },

 
  teacherId:{
    type:String,
    ref:"users",
    required:true
  },
  assistantId:{
    type:String,
    ref:"users",
    default:null
  },

  courseFee:{
    type:Number,
    required:true,
    min:0 
  },
  currency:{
    type:String,
    default:"LKR",
    immutable:true
  },

  courseImage:
    {
      type:String,
     default:"https://via.placeholder.com/400x225?text=course"
    },

  classTime: {
  type: String,
  enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      },
  startTime: { type: String },
  endTime:   { type: String },
    
    courseStatus:{
      type:String,
      enum:["Draft","Published","Archived","Suspended"],
      default:"Draft"
    },
   
    mode:{
      type:String,
      enum:[
        "Online","Physical", "Hybrid"
      ],
      default:"Online"
    },

tags:[{
  type:String,
  trim:true
}],
},

{timestamps:true}
);


const Courses = mongoose.model("courses",coursesSchema)
export default Courses;