require('dotenv').config();
const { createClient } = require('redis');

async function testRedis() {
  const client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
  await client.connect();
  console.log('Testing Redis...');

  const payload = { title: 'todo item' };

  let start = Date.now();
  for (let i = 0; i < 1000; i += 1) {
    await client.set(`todo:${i}`, JSON.stringify(payload));
  }
  let end = Date.now();
  console.log('Redis Insert Time:', end - start, 'ms');

  start = Date.now();
  for (let i = 0; i < 1000; i += 1) {
    await client.get(`todo:${i}`);
  }
  end = Date.now();
  console.log('Redis Read Time:', end - start, 'ms');

  await client.quit();
}

if (require.main === module) {
  testRedis()
    .then(() => console.log('Redis performance test complete'))
    .catch((err) => {
      console.error('Redis performance test failed:', err);
      process.exit(1);
    });
}

module.exports = testRedis;
