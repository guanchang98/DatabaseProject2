const express = require("express");
const { Int32 } = require("mongodb");
const router = express.Router();

const myDb = require("../db/myMongoDB.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.redirect("/schedule");
});

// http://localhost:3000/courses?pageSize=24&page=3&q=Chang
router.get("/courses", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getCoursesCount(query);
    let courses = await myDb.getCourses(query, page, pageSize);
    /*for (let course of courses) {
      console.log("course", {
        course
      });
    }*/
    res.render("./pages/index", {
      courses,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total/pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/courses/:courseID/edit", async (req, res, next) => {
  const courseID = req.params.courseID;

  const msg = req.query.msg || null;
  try {

    let course = await myDb.getCourseByID(courseID);
    let students = await myDb.getStudentsByCourseID(courseID);
    
    course = course[0];
    //console.log(Array.isArray(course));
    console.log("edit course", {
      course,
      students,
      msg,
    });


    res.render("./pages/editCourse", {
      course,
      students,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/courses/:courseID/edit", async (req, res, next) => {
  //console.log("here" + " " + req.body);
  const courseID = req.params.courseID;
  const course = req.body;
  

  try {

    let updateResult = await myDb.updateCourseByID(courseID, course);
    console.log("update", updateResult);

    if (updateResult && updateResult.modifiedCount === 1) {
      res.redirect("/courses/?msg=Updated");
    } else {
      res.redirect("/courses/?msg=Error Updating");
    }

  } catch (err) {
    next(err);
  }
});

router.post("/courses/:courseID/addStudent", async (req, res, next) => {
  console.log("Add student", req.body);
  const courseID = req.params.courseID;
  const studentID = req.body.studentID;

  try {

    let updateResult = await myDb.addStudentIDToCourseID(courseID, studentID);
    console.log("addStudentIDToCourseID", updateResult);

    if (updateResult && updateResult.modifiedCount === 1) {
      res.redirect(`/courses/${courseID}/edit?msg=Student added`);
    } else {
      res.redirect(`/courses/${courseID}/edit?msg=Error adding student`);
    }

  } catch (err) {
    next(err);
  }
});

router.get("/courses/:courseID/delete", async (req, res, next) => {
  const courseID = req.params.courseID;

  try {

    let deleteResult = await myDb.deleteCourseByID(courseID);
    console.log("delete", deleteResult);

    if (deleteResult && deleteResult.deletedCount === 1) {
      res.redirect("/courses/?msg=Deleted");
    } else {
      res.redirect("/courses/?msg=Error Deleting");
    }

  } catch (err) {
    next(err);
  }
});

router.post("/createCourse", async (req, res, next) => {
  const course = req.body;
  console.log(course);
  const newCourse =  {"courseID": Int32(course.courseID), "courseName": course.courseName, 
  "carType": course.carType, "startTime": course.startTime, "duration": course.duration, 
  "courseInfo": null, "capacity": Int32(course.capacity), "coach": {"firstName": course.firstName, 
  "lastName": course.lastName}, "students":[]
  }
  try {
    console.log(course);
    const insertRes = await myDb.insertCourse(newCourse);

    console.log("Inserted", insertRes);
    res.redirect("/courses/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

router.post("/createStudent", async (req, res, next) => {
  const student = req.body;

  try {
    console.log(student);
    const insertRes = await myDb.insertStudent(student);
    console.log("Inserted", insertRes);
    res.redirect("/schedule/?msg=New Student Added");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

// router.get("/coaches/:coachID", async (req, res, next) => {
//   const coachID = req.params.coachID;
//
//   try {
//
//     let coach = await myDb.getCoachByID(coachID);
//     console.log("coach", coach);
//
//
//   } catch (err) {
//     next(err);
//   }
// });

router.get("/schedule", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getCoursesCount(query);
    let courses = await myDb.getCourses(query, page, pageSize);
    /*for (let course of courses) {
      console.log("course", {
        course
      });
    }*/
    res.render("./pages/schedule", {
      courses,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total/pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/courses/:courseID/schedule", async (req, res, next) => {
  const courseID = req.params.courseID;

  const msg = req.query.msg || null;
  try {

    let course = await myDb.getCourseByID(courseID);
    let students = await myDb.getStudentsByCourseID(courseID);
    //let coach = await  myDb.getCoachByCourseID(courseID);
    course = course[0];
    console.log("schedule course", {
      course,
      //coach,
      students,
      msg,
    });


    res.render("./pages/scheduleCourse", {
      course,
      //coach,
      students,
      msg,
    });
  } catch (err) {
    next(err);
  }
});
//
// router.post("/courses/:courseID/schedule", async (req, res, next) => {
//   const courseID = req.params.courseID;
//   const course = req.body;
//
//   try {
//
//     let updateResult = await myDb.updateCourseByID(courseID, course);
//     console.log("update", updateResult);
//
//     if (updateResult && updateResult.changes === 1) {
//       res.redirect("/courses/?msg=Updated");
//     } else {
//       res.redirect("/courses/?msg=Error Updating");
//     }
//
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
