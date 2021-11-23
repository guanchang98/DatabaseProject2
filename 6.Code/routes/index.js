const express = require("express");
const router = express.Router();

const myDb = require("../db/mySqliteDB.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.redirect("/courses");
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
  const courseID = req.params.courseID;
  const course = req.body;

  try {

    let updateResult = await myDb.updateCourseByID(courseID, course);
    console.log("update", updateResult);

    if (updateResult && updateResult.changes === 1) {
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

    if (updateResult && updateResult.changes === 1) {
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

    if (deleteResult && deleteResult.changes === 1) {
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

  try {
    console.log(course);
    const insertRes = await myDb.insertCourse(course);

    console.log("Inserted", insertRes);
    res.redirect("/courses/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

module.exports = router;
