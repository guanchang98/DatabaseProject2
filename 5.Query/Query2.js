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
    A Query contains a complex search criterion (more than one expression with logical connectors).
    Find 10 coaches whose ratings is more than 4.8 and has less than 5 students
    or ratings less than 4.6 and has more than 10 students.
    */
    const pipeline = [
        {
           '$match': {
              '$or': [
                  {'$and': [
                    {'capacity': {'$lte': 5}}, 
                    {'coach.ratings': {'$gte': 4.8}}
                    ]},
                  {'$and': [
                    {'capacity': {'$gte': 10}}, 
                    {'coach.ratings': {'$lte': 4.6}}
                  ]}
              ]
            }
         }, {
           '$sort': {
             'coach.ratings': -1
            }
         }, {
           '$limit': 10
         }, {
             '$project': {
                 'coach.firstName': 1,
                 'coach.lastName': 1,
                 'coach.ratings': 1,
                 'capacity': 1,
                 '_id': 0
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