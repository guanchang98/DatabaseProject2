const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function getCourses(query, page, pageSize) {
  console.log("getCourses", query);

  const db = await open({
    filename: "./db/database.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Course
    WHERE courseName LIKE @query
    ORDER BY courseName ASC
    LIMIT @pageSize
    OFFSET @offset;
    `);

  const params = {
    "@query": query + "%",
    "@pageSize": pageSize,
    "@offset": (page - 1) * pageSize,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function getCoursesCount(query) {
  console.log("getCourses", query);

  const db = await open({
    filename: "./db/database.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM Course
    WHERE courseName LIKE @query;
    `);

  const params = {
    "@query": query + "%",
  };

  try {
    return (await stmt.get(params)).count;
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function getCourseByID(courseID) {
  console.log("getCourseByID", courseID);

  const db = await open({
    filename: "./db/database.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Course
    WHERE courseID = @courseID;
    `);

  const params = {
    "@courseID": courseID
  };

  try {
    return await stmt.get(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function updateCourseByID(courseID, course) {
  console.log("updateCourseByID", courseID, course);

  const db = await open({
    filename: "./db/database.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    UPDATE Course
    SET
      courseName = @courseName,
      startTime = @startTime
    WHERE
      courseID = @courseID;
    `);

  const params = {
    "@courseID": courseID,
    "@courseName": course.courseName,
    "@startTime": course.startTime,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function deleteCourseByID(courseID) {
  console.log("deleteCourseByID", courseID);

  const db = await open({
    filename: "./db/database.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    DELETE FROM Course
    WHERE
      courseID = @courseID;
    `);

  const params = {
    "@courseID": courseID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function insertCourse(course) {
  const db = await open({
    filename: "./db/database.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`INSERT INTO
    Course(courseID, courseName, carType, startTime, duration, capacity, coachID)
    VALUES (@courseID, @courseName, @carType, @startTime, @duration, @capacity, @coachID);`);

  try {
    return await stmt.run({
      "@courseID": course.courseID,
      "@courseName": course.courseName,
      "@carType":course.carType,
      "@startTime": course.startTime,
      "@duration": course.duration,
      "@capacity": course.capacity,
      "@coachID": course.coachID,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}


async function getStudentsByCourseID(courseID) {
  console.log("getStudentsByCourseID", courseID);

  const db = await open({
    filename: "./db/database.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Appointments
    NATURAL JOIN Student
    WHERE courseID = @courseID;
    `);

  const params = {
    "@courseID": courseID,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}


async function addStudentIDToCourseID(courseID, studentID) {
  console.log("addStudentIDToCourseID", courseID, studentID);

  const db = await open({
    filename: "./db/database.db",
    driver: sqlite3.Database,

  });

  const stmt = await db.prepare(`
    INSERT INTO
    Appointments(courseID, studentID)
    VALUES (@courseID, @studentID);
    `);

  const params = {
    "@courseID": courseID,
    "@studentID": studentID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
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
