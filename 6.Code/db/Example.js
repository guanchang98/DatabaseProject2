const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = "ReferenceManager";
const COL_NAME = "Reference";

async function getReferences(query, page, pageSize) {
  console.log("getReferences", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      //title: { $regex: `^${query}`, $options: "i" },
    };

    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .find(queryObj)
      .sort({ created_on: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .toArray();
  } finally {
    client.close();
  }
}

async function getReferencesCount(query) {
  console.log("getReferencesCount", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      title: { $regex: `^${query}`, $options: "i" },
    };

    return await client.db(DB_NAME).collection(COL_NAME).find(queryObj).count();
  } finally {
    client.close();
  }
}

async function getReferenceByID(reference_id) {
  console.log("getReferenceByID", reference_id);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      _id: new ObjectId(reference_id),
      // reference_id: +reference_id,
    };

    return await client.db(DB_NAME).collection(COL_NAME).findOne(queryObj);
  } finally {
    client.close();
  }
}

async function updateReferenceByID(reference_id, ref) {
  console.log("updateReferenceByID", reference_id, ref);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      _id: new ObjectId(reference_id),
      // reference_id: +reference_id,
    };

    // If tags is a string convert it to an array
    if (typeof ref.tags === "string") {
      ref.tags = ref.tags.split(",").map((t) => t.trim()); // removes whitespace
    }

    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .updateOne(queryObj, { $set: ref });
  } finally {
    client.close();
  }
}

async function deleteReferenceByID(reference_id) {
  console.log("deleteReferenceByID", reference_id);

  // const db = await open({
  //   filename: "./db/database.db",
  //   driver: sqlite3.Database,
  // });

  // const stmt = await db.prepare(`
  //   DELETE FROM Reference
  //   WHERE
  //      reference_id = @reference_id;
  //   `);

  // const params = {
  //   "@reference_id": reference_id,
  // };

  // try {
  //   return await stmt.run(params);
  // } finally {
  //   await stmt.finalize();
  //   db.close();
  // }
}

async function insertReference(ref) {
  // const db = await open({
  //   filename: "./db/database.db",
  //   driver: sqlite3.Database,
  // });
  // const stmt = await db.prepare(`INSERT INTO
  //   Reference(title, published_on)
  //   VALUES (@title, @published_on);`);
  // try {
  //   return await stmt.run({
  //     "@title": ref.title,
  //     "@published_on": ref.published_on,
  //   });
  // } finally {
  //   await stmt.finalize();
  //   db.close();
  // }
}

async function getAuthorsByReferenceID(reference_id) {
  console.log("getAuthorsByReferenceID", reference_id);

  // const db = await open({
  //   filename: "./db/database.db",
  //   driver: sqlite3.Database,
  // });

  // const stmt = await db.prepare(`
  //   SELECT * FROM Reference_Author
  //   NATURAL JOIN Author
  //   WHERE reference_id = @reference_id;
  //   `);

  // const params = {
  //   "@reference_id": reference_id,
  // };

  // try {
  //   return await stmt.all(params);
  // } finally {
  //   await stmt.finalize();
  //   db.close();
  // }
}

async function addVenueToReferenceID(reference_id, venue) {
  console.log("addVenueToReferenceID", reference_id, venue);


  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      _id: new ObjectId(reference_id),
      // reference_id: +reference_id,
    };


    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .updateOne(queryObj, { $push: { venues: venue } });
  } finally {
    client.close();
  }

}

module.exports.getReferences = getReferences;
module.exports.getReferencesCount = getReferencesCount;
module.exports.insertReference = insertReference;
module.exports.getReferenceByID = getReferenceByID;
module.exports.updateReferenceByID = updateReferenceByID;
module.exports.deleteReferenceByID = deleteReferenceByID;
module.exports.getAuthorsByReferenceID = getAuthorsByReferenceID;
module.exports.addVenueToReferenceID = addVenueToReferenceID;