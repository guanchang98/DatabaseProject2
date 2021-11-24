const { MongoClient, Long } = require("mongodb");

async function getCourses() {
  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("P2ChangGuan");
    const studentsCollection = db.collection("Students");
    //const coursesCollection = db.collection("Courses");

    /* 
    A Query for finding all students with first name with 'am' in 
    somewhere 
    */
    const query = {
       "firstName": {"$regex": '.*am.*'}
    };
    const res = await studentsCollection.find(query).toArray();
    console.log(res);
    return res;
  } finally {
    await client.close();
  }
}

module.exports.getCourses = getCourses;

getCourses();