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
    A Query using aggregation.
    Find the number of coaches in each state, e.x. "CA" 
    who teach course in driving school ordered by the number.
    */
    const pipeline = [
        {
           '$group': {
              '_id': '$coach.location', 
              'count': {
                '$sum': 1
              }
            }
         }, {
           '$sort': {
             'count': -1
            }
         }, {
           '$limit': 10
         }, {
             '$project': {
                 'coach.location': 1,
                 'count': 1,
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