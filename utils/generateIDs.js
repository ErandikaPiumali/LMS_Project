export async function generateId(model, prefix, scopeFilter = {}) {

  const year = new Date().getFullYear().toString().slice(-2);
  const currentPrefix = `${prefix}${year}-`;

  const lastDoc = await model.findOne(
    {
      ...scopeFilter,
      $or: [
        { userId:       { $regex: `^${currentPrefix}` } },
        { courseId:     { $regex: `^${currentPrefix}` } },
        { enrollmentId: { $regex: `^${currentPrefix}` } },
        { sectionId:    { $regex: `^${currentPrefix}` } },
        { resourceId:   { $regex: `^${currentPrefix}` } },
      ],
    },
    null,
    { sort: { _id: -1 } }
  );

  if (!lastDoc) {
    return `${currentPrefix}0001`;
  }

  const lastId =
    lastDoc.sectionId    ||
    lastDoc.enrollmentId ||
    lastDoc.courseId     ||
    lastDoc.userId       ||
    lastDoc.resourceId;

  const lastNumber = parseInt(lastId.split("-")[1]);
  return `${currentPrefix}${(lastNumber + 1).toString().padStart(4, "0")}`;
}

export const rolePrefixes = {
  Student:           "ST",
  Teacher:           "TC",
  Admin:             "AD",
  "Payment Manager": "PM",
  Assistant:         "AS",
};

export const collectionPrefixes = {
  Course:     "CR",
  Section:    "SC",
  Resource:   "RS",
  Enrollment: "EN",
};