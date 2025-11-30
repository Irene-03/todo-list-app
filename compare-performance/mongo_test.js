require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testMongo() {
  const uri = process.env.MONGO_URL || process.env.LEARNING_MONGODB_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Set MONGO_URL, LEARNING_MONGODB_URI, or MONGODB_URI to run MongoDB performance tests');
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.PERF_DB_NAME || 'test_db');
  const collection = db.collection(process.env.PERF_COLLECTION_NAME || 'todos_perf');

  console.log('Testing MongoDB Atlas...');

  const payload = { title: 'todo item' };

  await collection.deleteMany({});

  let start = Date.now();
  for (let i = 0; i < 1000; i += 1) {
    await collection.insertOne(payload);
  }
  let end = Date.now();
  console.log('MongoDB Insert Time:', end - start, 'ms');

  start = Date.now();
  await collection.find({}).toArray();
  end = Date.now();
  console.log('MongoDB Read Time:', end - start, 'ms');

  await client.close();
}

if (require.main === module) {
  testMongo()
    .then(() => console.log('MongoDB performance test complete'))
    .catch((err) => {
      console.error('MongoDB performance test failed:', err);
      process.exit(1);
    });
}

module.exports = testMongo;
