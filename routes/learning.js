const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { createClient } = require('redis');
const asyncHandler = require('../middleware/asyncHandler');

const MODES = {
  ADVANCED: 'advanced',
  MONGO: 'mongo-basic',
  REDIS: 'redis-basic'
};

function createLearningRouter(mode = MODES.ADVANCED) {
  const router = express.Router();

  router.use((req, res, next) => {
    if (typeof res.skipStandardFormat === 'function') {
      res.skipStandardFormat();
    }
    next();
  });

  if (mode === MODES.MONGO) {
    setupMongoRoutes(router);
  } else if (mode === MODES.REDIS) {
    setupRedisRoutes(router);
  } else {
    router.get('/', (req, res) => {
      res.status(200).json({
        message: 'Learning mode is disabled. Set LEARNING_MODE to "mongo-basic" or "redis-basic" to enable minimal APIs.'
      });
    });
  }

  return router;
}

function setupMongoRoutes(router) {
  const mongoUri = process.env.LEARNING_MONGODB_URI || process.env.MONGODB_URI;
  const dbName = process.env.LEARNING_DB_NAME || process.env.DB_NAME || 'todo_db';
  if (!mongoUri) {
    throw new Error('MongoDB URI is required for mongo-basic learning mode. Set LEARNING_MONGODB_URI or MONGODB_URI.');
  }

  const client = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
  let mongoDb;

  async function getCollection() {
    if (!mongoDb) {
      await client.connect();
      mongoDb = client.db(dbName);
      console.log(`[Learning Mode] Connected to MongoDB database: ${dbName}`);
    }
    return mongoDb.collection(process.env.LEARNING_COLLECTION_NAME || 'todos');
  }

  router.post('/', asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const collection = await getCollection();
    const result = await collection.insertOne({
      title,
      completed: false,
      createdAt: new Date()
    });

    res.json({
      _id: result.insertedId,
      title,
      completed: false
    });
  }));

  router.get('/', asyncHandler(async (_req, res) => {
    const collection = await getCollection();
    const todos = await collection.find().toArray();
    res.json(todos);
  }));

  router.put('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (typeof completed === 'undefined' && typeof title === 'undefined') {
      return res.status(400).json({ error: 'Provide title or completed field to update' });
    }

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const collection = await getCollection();
    const updateDoc = { $set: {} };
    if (typeof title !== 'undefined') updateDoc.$set.title = title;
    if (typeof completed !== 'undefined') updateDoc.$set.completed = completed;

    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      updateDoc,
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.value);
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    let objectId;
    try {
      objectId = new ObjectId(req.params.id);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const collection = await getCollection();
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted' });
  }));
}

function setupRedisRoutes(router) {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error('REDIS_URL is required for redis-basic learning mode.');
  }

  const client = createClient({ url: redisUrl });
  client.on('error', (err) => console.error('[Learning Mode] Redis error:', err));

  let isConnected = false;
  const ID_KEY = process.env.REDIS_TODO_ID_KEY || 'todo:id';
  const LIST_KEY = process.env.REDIS_TODO_LIST_KEY || 'todo:ids';

  async function getRedis() {
    if (!isConnected) {
      await client.connect();
      isConnected = true;
      console.log('[Learning Mode] Connected to Redis');
    }
    return client;
  }

  router.post('/', asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const redis = await getRedis();
    const id = await redis.incr(ID_KEY);

    const todo = {
      id,
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    await redis.set(`todo:${id}`, JSON.stringify(todo));
    await redis.rPush(LIST_KEY, id.toString());

    res.json(todo);
  }));

  router.get('/', asyncHandler(async (_req, res) => {
    const redis = await getRedis();
    const ids = await redis.lRange(LIST_KEY, 0, -1);
    const todos = [];

    for (const id of ids) {
      const data = await redis.get(`todo:${id}`);
      if (data) {
        todos.push(JSON.parse(data));
      }
    }

    res.json(todos);
  }));

  router.put('/:id', asyncHandler(async (req, res) => {
    const redis = await getRedis();
    const key = `todo:${req.params.id}`;
    const existing = await redis.get(key);

    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const { title, completed } = req.body;
    const parsed = JSON.parse(existing);
    if (typeof title !== 'undefined') parsed.title = title;
    if (typeof completed !== 'undefined') parsed.completed = completed;

    await redis.set(key, JSON.stringify(parsed));
    res.json(parsed);
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    const redis = await getRedis();
    const key = `todo:${req.params.id}`;

    const deleted = await redis.del(key);
    if (deleted === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await redis.lRem(LIST_KEY, 1, req.params.id);
    res.json({ message: 'Todo deleted' });
  }));
}

module.exports = {
  createLearningRouter,
  LEARNING_MODES: MODES
};
