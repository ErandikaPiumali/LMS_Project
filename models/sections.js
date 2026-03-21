import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    sectionId:{
        type:String,
       
        immutable:true
    },
    courseId:{
        type:String,
        ref:"courses",
        required:true,
        index:true
    },
    sectionTitle:{
        type:String,
        required:true,
        trim:true,
        maxlength:100
    },
    sectionDescription:{
        type:String,
        trim:true,
        default:null
    },
    sectionOrder:{
        type:Number,
        required:true,
        min:1
    },
    isVisible:{
        type:Boolean,
        default:true
    },
    createdBy:{
        type:String,
        ref:"users",
        required:true
    },
},
{timestamps:true}

);
sectionSchema.index({
    courseId:1,
    sectionOrder:1
},
{unique:true}
);


const Section = mongoose.model("sections",sectionSchema);
export default Section;