// ======================================================================
// Express TODO Application - Phase 2 Enhanced
// With CORS, Helmet, Morgan, Compression, Validation & SQLite
// ======================================================================

require('dotenv').config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const { notFound, errorHandler } = require("./middleware/errorHandler");
const formatResponse = require("./middleware/formatResponse");
const todosRouter = require("./routes/todos");

const app = express();
const PORT = process.env.PORT || 3000;

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

// ======================================================================
// STATIC FILES & ROUTES
// ======================================================================

// Static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/todos", todosRouter);

// ======================================================================
// ERROR HANDLING
// ======================================================================

// 404 for unknown routes
app.use(notFound);

// Central error handler
app.use(errorHandler);

// ======================================================================
// START SERVER
// ======================================================================

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Logging to access.log`);
  console.log(`🔒 Security headers enabled`);
  console.log(`🗜️  Compression enabled`);
  console.log(`🌐 CORS origins: ${allowedOrigins.join(', ')}`);
});
