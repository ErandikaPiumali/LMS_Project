import mongoose from "mongoose";
import { CLASS_LEVELS, SUBJECTS } from "../utils/modelSchemas.js";

const coursesSchema = new mongoose.Schema({
  courseId:{
    type:String,
    unique:true,
    immutable:true

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
default:null
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
    min:0 //No negative
  },
  currency:{
    type:String,
    default:"LKR",
    immutable:true
  },

  courseImage:
    {
      type:String,
     default:"http://via.placeholder.com/400x225?text=course"
    },

  classTime: {
  type: String,
  default: null  
},
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
courseRatings:[
  {
    studentId:{
      type:String,
      ref:"users"
  },
  ratings:{
    type:Number,
    min:1,
    max:5,
    required:true

  },
  review:{
    type:String,
    trim:true

  },

  createdAt:{
    type:Date,
    default:Date.now
  },



},],
averageRating:{
  type:Number,
  default:0
},

tags:[{
  type:String,
  trim:true
}]

    
  

},{timestamps:true});





const Courses = mongoose.model("courses",coursesSchema)
export default Courses;