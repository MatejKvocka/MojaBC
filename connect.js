const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'eurocoins';

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

  const db = client.db(dbName);
  // Now you have access to the MongoDB database instance (db object)
  // You can perform database operations (e.g., querying, updating) using this object
});