const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const healthCheck = () => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve('Health check passed');
      } else {
        reject(`Health check failed with status code: ${res.statusCode}`);
      }
    });

    req.on('error', (err) => {
      reject(`Health check failed: ${err.message}`);
    });

    req.on('timeout', () => {
      req.destroy();
      reject('Health check timed out');
    });

    req.setTimeout(options.timeout);
    req.end();
  });
};

// Check if this script is run directly
if (require.main === module) {
  healthCheck()
    .then(() => {
      console.log('✅ Health check passed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Health check failed:', error);
      process.exit(1);
    });
}

module.exports = healthCheck;