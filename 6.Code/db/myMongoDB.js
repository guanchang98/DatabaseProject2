const { MongoClient, ObjectId, Int32 } = require("mongodb");
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = "P2ChangGuan";
const COL_Courses = "Courses";
const COL_Students = "Students";


async function getCourses(query, page, pageSize) {
  console.log("getCourses", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const queryObj = {
      //"query": { $regex: `^${query}`, $options: "i" },
    };
    //console.log(queryObj);
    return await client
      .db(DB_NAME)
      .collection(COL_Courses)
      .find(queryObj)
      .sort({ "courseName": 1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .toArray();
  } finally {
    client.close();
  }
}

async function getCoursesCount(query) {
  console.log("getCoursesCount", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      //title: { $regex: `^${query}`, $options: "i" },
    };

    return await client.db(DB_NAME).collection(COL_Courses).find(queryObj).count();
  } finally {
    client.close();
  }
}

async function getCourseByID(courseID) {
  console.log("getCourseByID", courseID);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      "courseID": Int32(courseID),
      //_id: ObjectId(courseID),
      // reference_id: +reference_id,
    };
    const course = await client.db(DB_NAME).collection(COL_Courses).find(queryObj).toArray();
    return course;
  } finally {
    client.close();
  }
}

async function updateCourseByID(courseID, course) {
  console.log("updateCourseByID", courseID, course);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      "courseID": Int32(courseID)
      //_id: ObjectId(courseID),
      // reference_id: +reference_id,
    };

    // If tags is a string convert it to an array
    /*if (typeof course.tags === "string") {
      course.tags = course.tags.split(",").map((t) => t.trim()); // removes whitespace
    }*/
    let newvalues = { $set: course };
    return await client
      .db(DB_NAME)
      .collection(COL_Courses)
      .updateOne(queryObj, newvalues);
  } finally {
    client.close();
  }
}

async function deleteCourseByID(courseID) {
  console.log("deleteCourseByID", courseID);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      "courseID": Int32(courseID),
      // reference_id: +reference_id,
    };

    return await client
      .db(DB_NAME)
      .collection(COL_Courses)
      .deleteOne(queryObj);
  } finally {
    client.close();
  }
}

async function insertCourse(course) {
  console.log("insertCourse");

  const client = new MongoClient(uri);

  try {
    await client.connect();

    /*const queryObj = {
      //_id: new ObjectId(CourseID),
      course
      // reference_id: +reference_id,
    };*/

    // If tags is a string convert it to an array
    /*if (typeof course.tags === "string") {
      course.tags = course.tags.split(",").map((t) => t.trim()); // removes whitespace
    }*/

    return await client
      .db(DB_NAME)
      .collection(COL_Courses)
      .insertOne(course);
  } finally {
    client.close();
  }
}


async function getStudentsByCourseID(courseID) {
  console.log("getStudentsByCourseID", courseID);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const pipeline =  [
      {
        '$lookup': {
          'from': 'Students', 
          'localField': 'students.sID', 
          'foreignField': 'studentID', 
          'as': 'Students'
        }
      }, {
        '$match': {
          'courseID': Int32(courseID)
        }
      }, {
        '$project': {
          'Students': 1, 
          '_id': 0
        }
      }, {
        '$unwind': {
          'path': '$Students'
        }
      }
    ];
    const students = await client.db(DB_NAME).collection(COL_Courses).aggregate(pipeline).toArray();
    const arr = new Array();
    for (let s of students) {
      arr.push(s['Students']);
    }
    return arr;
  } finally {
    client.close();
  }
  
}


async function addStudentIDToCourseID(courseID, studentID) {
  console.log("addStudentIDToCourseID", courseID, studentID);
  
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj =  {
      "studentID": Int32(studentID),
    };
    let student = await client.db(DB_NAME).collection(COL_Students).find(queryObj).toArray();
    student = student[0];
    let studentAdded = {"sID": student.studentID, "firstName": student.firstName,
  "lastName": student.lastName, "email": student.email}
    const queryObj2 = {
      "$addToSet": {students: studentAdded}
    }
    const res = await client.db(DB_NAME).collection(COL_Courses)
    .updateOne({"courseID": Int32(courseID)}, queryObj2);
    console.log(res);
    return res;
  } finally {
    client.close();
  }
}

async function insertStudent(student) {
  console.log("insertStudent");

  const client = new MongoClient(uri);

  try {
    await client.connect();

    /*const queryObj = {
      //_id: new ObjectId(CourseID),
      course
      // reference_id: +reference_id,
    };*/

    // If tags is a string convert it to an array
    /*if (typeof course.tags === "string") {
      course.tags = course.tags.split(",").map((t) => t.trim()); // removes whitespace
    }*/
    let studentAdded = {"studentID": Int32(student.studentID), "firstName": student.firstName,
    "lastName": student.lastName, "gender": student.gender, "phoneNumber": student.phoneNumber,
    "email": student.email, "address": student.address
    };
    return await client
      .db(DB_NAME)
      .collection(COL_Students)
      .insertOne(studentAdded);
  } finally {
    client.close();
  }
}


module.exports.getCourses = getCourses;
module.exports.getCoursesCount = getCoursesCount;
module.exports.insertCourse = insertCourse;
module.exports.getCourseByID = getCourseByID;
module.exports.updateCourseByID = updateCourseByID;
module.exports.deleteCourseByID = deleteCourseByID;
module.exports.getStudentsByCourseID = getStudentsByCourseID;
module.exports.addStudentIDToCourseID = addStudentIDToCourseID;
module.exports.insertStudent = insertStudent;
