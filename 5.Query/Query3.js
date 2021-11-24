const { MongoClient, Long } = require("mongodb");

async function getCourses() {
  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("P2ChangGuan");
    //const studentsCollection = db.collection("Students");
    const coursesCollection = db.collection("Courses");

    /* 
    A Query counts documents for a specific user(student).
    Find 30 students' first names who take most courses in the driving school.
    The result is sorted by the number of courses.
    Besides, find the number of courses of a student whose first name is Lyell
    from the result above.
    */
    const pipeline = [
        {
            '$unwind': {
                'path': '$students'
            }
        },{
            '$match': {'students.firstName': "Lyell"}
        }, {
           '$group': {
              '_id': '$students.firstName', 
              'count': {
                '$sum': 1
              }
            }
         }, {
           '$sort': {
             'count': -1
            }
         }, {
           '$limit': 30
         }, {
             '$project': {
                 'count': 1,
                 '_id': 1
             }
         }
      ];
    const res = await coursesCollection.aggregate(pipeline).toArray();
    console.log(res);
    return res;
  } finally {
    await client.close();
  }
}

module.exports.getCourses = getCourses;

getCourses();