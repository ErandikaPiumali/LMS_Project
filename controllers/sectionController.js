import { isAdmin, isTeacher } from "../middleware/authMiddleware.js";
import Courses from "../models/courses.js";
import Section from "../models/sections.js";
import { collectionPrefixes, generateId } from "../utils/generateIDs.js";

export async function createSections(req,res){
   
    try{

        const{courseId} =req.params;

        const course =await Courses.findOne({courseId});
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            });
        }

 if(!(isAdmin(req) || (isTeacher(req)&& course.teacherId === req.User.userId))){
  
        return res.status(403).json({ message: "You are not allowed to create this section" });
      }

     const allowedSectionFields = [
      "sectionTitle",
      "sectionDescription",
      "sectionOrder",
      "isVisible"
    ];

    const sectionData = {}; 
        
    allowedSectionFields.forEach((field)=>{

    if(req.body[field]!==undefined){
        sectionData[field]=req.body[field];
    }
}
);

sectionData.courseId =courseId;
sectionData.createdBy=req.User.userId;
sectionData.sectionId =await generateId(Section,
    collectionPrefixes.Section,
    {courseId}
);

const section =new Section(sectionData);
const savedSection =await section.save();

return res.status(201).json({
    message: `Section ${savedSection.sectionId} created successfully`,
    section:savedSection
});

 }
catch(error){
    console.error("Error creating sections",error)
    return res.status(400).json({
        message:"Failed to create a section"
        
    });

    }
   
  }

  


