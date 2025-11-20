// ======================================================================
// Express TODO Application - Phase 3 Enhanced
// With MongoDB, JWT Authentication, Rate Limiting & HTTPS Support
// ======================================================================

require('dotenv').config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const connectDB = require("./config/database");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const formatResponse = require("./middleware/formatResponse");
const { apiLimiter } = require("./middleware/rateLimiter");

const authRouter = require("./routes/auth");
const todosRouter = require("./routes/todos");

const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// ======================================================================
// DATABASE CONNECTION
// ======================================================================

connectDB();

// ======================================================================
// SECURITY & OPTIMIZATION MIDDLEWARES
// ======================================================================

// 1. Helmet - Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for local development with inline scripts
}));

// 2. CORS - Cross-Origin Resource Sharing
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 3. Compression - Reduce response size
app.use(compression());

// 4. Morgan - HTTP request logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream })); // Log to file
app.use(morgan('dev')); // Log to console

// 5. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Format Response - Standardize all responses
app.use(formatResponse);

// 7. Rate Limiting - Apply to all API routes
app.use('/api', apiLimiter);

// ======================================================================
// STATIC FILES & ROUTES
// ======================================================================

// Static files (frontend)
app.use(express.static(path.join(__dirname, "public")));
app.use('/reports', express.static(path.join(__dirname, "reports")));
app.use('/docs', express.static(path.join(__dirname, "docs")));

// Welcome page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// Dashboard (requires auth - handled by frontend)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/todos", todosRouter);

// ======================================================================
// ERROR HANDLING
// ======================================================================

// 404 for unknown routes
app.use(notFound);

// Central error handler
app.use(errorHandler);

// ======================================================================
// START SERVERS (HTTP & HTTPS)
// ======================================================================

// Start HTTP server
app.listen(PORT, () => {
  console.log(`✅ HTTP Server running on http://localhost:${PORT}`);
  console.log(`📝 Logging to access.log`);
  console.log(`🔒 Security headers enabled`);
  console.log(`🗜️  Compression enabled`);
  console.log(`🌐 CORS origins: ${allowedOrigins.join(', ')}`);
  console.log(`🔐 JWT Authentication enabled`);
  console.log(`⏱️  Rate limiting active`);
});

// Start HTTPS server (if certificates exist)
if (fs.existsSync('./cert/key.pem') && fs.existsSync('./cert/cert.pem')) {
  const httpsOptions = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
  };

  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`🔐 HTTPS Server running on https://localhost:${HTTPS_PORT}`);
  });
} else {
  console.log(`⚠️  HTTPS certificates not found. Run: npm run generate-cert`);
}
