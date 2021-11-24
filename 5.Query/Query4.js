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
    A Query updates a document based on a query parameter
    Using the upsert option to make sure the query go well.
    Update a course which car type is Brougham. Set the duration, 
    startTime and capacity parameters to "3 Hours", "14:01", 8, respectively.
    */
   const filter = { 'carType': "Brougham" };
   const options = { upsert: true };
   const updateDoc = {
     $set: {
       "duration": "3 Hours",
       "startTime": "14:01",
       "capacity": 8,
     },
   };
   const result = await coursesCollection.updateOne(filter, updateDoc, options);
   console.log(
     `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
   );
  } finally {
    await client.close();
  }
}

module.exports.getCourses = getCourses;

getCourses();