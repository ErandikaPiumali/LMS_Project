export async function generateId(model,prefix){


const year = new Date().getFullYear().toString().slice(-2);
const currentPrefix = `${prefix}${year}-`;

const lastDoc = await model.findOne(
    {
      // find field that contains this prefix
      // works for userId, courseId, sectionId, resourceId
      $or: [
        { userId: { $regex: `^${currentPrefix}` } },
        //{ courseId: { $regex: `^${currentPrefix}` } },
       // { sectionId: { $regex: `^${currentPrefix}` } },
        //{ resourceId: { $regex: `^${currentPrefix}` } },
      ],
    },
    null,
    { sort: { _id: -1 } } // get the most recently created one
  );

  if (!lastDoc) {
    // No document exists with this prefix yet → start from 0001
    return `${currentPrefix}0001`;
  }

  const lastId =
    lastDoc.userId 
  //  || lastDoc.courseId ||
  //  lastDoc.sectionId ||
   // lastDoc.resourceId;

    const lastNumber = parseInt(lastId.split("-")[1]);

return `${currentPrefix}${(lastNumber + 1).toString().padStart(4, "0")}`;


}

export const rolePrefixes = {
  Student: "ST",
  Teacher: "TC",
  Admin: "AD",
  "Payment Manager": "PM",
  Assistant: "AS",
};

