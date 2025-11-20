# 📋 TODO Dashboard - Secure API with Express.js

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)
![Express.js](https://img.shields.io/badge/Express.js-4.21-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

**A professional RESTful API with MongoDB, JWT Authentication, Rate Limiting, and HTTPS support**

[Features](#-features) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Testing](#-testing) • [Security](#-security) • [Documentation](#-documentation)

</div>

---

## 📁 Project Structure

For detailed project structure, see **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

```
todo-project-v2.2/
├── config/          # Database configuration
├── controllers/     # MVC Controllers
├── models/          # Mongoose Models
├── routes/          # API Routes
├── middleware/      # Custom Middleware
├── public/          # Frontend (HTML, CSS, JS)
├── docs/            # Technical Documentation
├── reports/         # HTML Reports
└── screenshots/     # Project Screenshots
```

---

## 🎯 Project Overview

This is a comprehensive TODO management application built as part of an Internet Engineering course project. It demonstrates modern backend development practices including:

- **Phase 1:** Basic Express.js REST API with in-memory storage
- **Phase 2:** SQLite database, Security middlewares (Helmet, CORS), Validation, Compression
- **Phase 3:** MongoDB integration, JWT authentication, Rate limiting, HTTPS server, MVC architecture

---

## ✨ Features

### 📱 Frontend
- Modern, responsive UI with dark theme
- Real-time task management (Create, Read, Update, Delete)
- Task filtering by status, priority, and custom groups
- Search functionality
- Calendar integration for due dates
- Weather widget
- Bulk operations
- Priority levels (low, normal, high)
- Important tasks marking
- Custom directories/groups organization

### ⚙️ Backend (Phase 3)

#### 🔐 Authentication & Security
- **JWT (JSON Web Token)** authentication
- Password hashing with bcryptjs
- Token-based authorization
- Protected routes with middleware
- User registration and login
- Role-based access control (user/admin)

#### 🗄️ Database
- **MongoDB** with Mongoose ODM
- User and Todo schemas with validation
- Indexes for optimized queries
- Relationship between users and todos

#### 🛡️ Security Middlewares
- **Helmet** - Security headers (XSS, Clickjacking protection)
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Prevent abuse and DDoS attacks
  - General API: 100 requests per 15 minutes
  - Authentication: 5 attempts per 15 minutes
  - Todo creation: 20 requests per 15 minutes

#### 🚀 Performance & Optimization
- **Compression** - Response compression (60-70% size reduction)
- **Morgan** - Professional HTTP request logging
- Response caching
- Efficient MongoDB queries with indexes

#### 🏗️ Architecture
- **MVC Pattern** - Separation of concerns
  - Models: Data schemas (User, Todo)
  - Controllers: Business logic
  - Routes: API endpoints
- **Middleware chain** - Modular request processing
- **Error handling** - Centralized error management
- **Input validation** - Express Validator

#### 🔒 HTTPS Support
- SSL/TLS encryption
- Self-signed certificates for development
- Secure connections on port 3443

---

## 📁 Project Structure

```
todo-project-v2.2/
│
├── 📁 config/
│   └── database.js              # MongoDB connection
│
├── 📁 models/
│   ├── user.js                  # User schema (Mongoose)
│   ├── todo.js                  # Todo schema (Mongoose)
│   ├── database.js              # SQLite config (Phase 2 - deprecated)
│   └── todoStore.js             # In-memory store (Phase 1 - deprecated)
│
├── 📁 controllers/
│   ├── authController.js        # Authentication logic
│   └── todoController.js        # Todo CRUD operations
│
├── 📁 routes/
│   ├── auth.js                  # Auth endpoints
│   └── todos.js                 # Todo endpoints
│
├── 📁 middleware/
│   ├── authenticateToken.js     # JWT verification
│   ├── rateLimiter.js           # Rate limiting rules
│   ├── errorHandler.js          # Global error handler
│   ├── formatResponse.js        # Response formatter
│   ├── asyncHandler.js          # Async error wrapper
│   └── logger.js                # Simple logger (deprecated)
│
├── 📁 public/
│   ├── index.html               # Frontend UI
│   ├── style.css                # Styles
│   └── script.js                # Frontend logic
│
├── 📁 cert/                     # SSL certificates (generated)
│
├── app.js                       # Main application entry
├── .env                         # Environment variables
├── package.json                 # Dependencies
│
├── README.md                    # This file
├── MONGODB_SETUP.md             # MongoDB installation guide
├── SSL_SETUP.md                 # SSL certificate guide
├── API_TESTING_GUIDE.md         # API testing instructions
│
├── PROJECT_REPORT.html          # Complete technical report
├── PHASE1_REPORT.html           # Phase 1 report
└── PHASE3_REPORT.html           # Phase 3 report
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone Repository

```bash
git clone https://github.com/Irene-03/todo-list-app.git
cd todo-list-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Windows: https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt install mongodb

# Start MongoDB service
mongod --dbpath /path/to/data
```

**Option B: MongoDB Atlas (Recommended)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` file

📖 **Detailed guide:** See [MONGODB_SETUP.md](./MONGODB_SETUP.md)

### Step 4: Configure Environment Variables

Create `.env` file in project root:

```env
# Server Configuration
PORT=3000
HTTPS_PORT=3443
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/todo-app
# Or for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/todo-app

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Security
API_KEY=your-secret-api-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Step 5: Generate SSL Certificates (Optional)

```bash
npm run generate-cert
```

Or see [SSL_SETUP.md](./SSL_SETUP.md) for alternatives.

### Step 6: Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on:
- **HTTP:** http://localhost:3000
- **HTTPS:** https://localhost:3443 (if certificates exist)

---

## 📊 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "username": "johndoe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Todo Endpoints (All require authentication)

#### Get All Todos
```http
GET /api/todos
Authorization: Bearer <token>

# Query parameters (optional):
?status=completed          # Filter by status
?important=true            # Only important
?priority=high             # Filter by priority
?search=keyword            # Search in text
?group=university          # Filter by group
```

#### Get Single Todo
```http
GET /api/todos/:id
Authorization: Bearer <token>
```

#### Create Todo
```http
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Complete project",
  "description": "Finish Phase 3",
  "priority": "high",
  "important": true,
  "dueDate": "2025-11-25",
  "groups": ["university", "web-engineering"]
}
```

#### Update Todo
```http
PUT /api/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

# Toggle done status:
{ "action": "toggle" }

# Or update fields:
{
  "text": "Updated text",
  "priority": "normal",
  "done": true
}
```

#### Delete Todo
```http
DELETE /api/todos/:id
Authorization: Bearer <token>
```

#### Clear Completed Todos
```http
DELETE /api/todos/completed
Authorization: Bearer <token>
```

#### Get Statistics
```http
GET /api/todos/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 5,
    "uncompleted": 5,
    "important": 3,
    "today": 2,
    "completionRate": "50.0"
  }
}
```

📖 **Complete guide:** See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)

---

## 🧪 Testing

### Using Postman

1. Import the API endpoints
2. Create environment variables:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (set after login)
3. Test authentication flow
4. Test CRUD operations
5. Test rate limiting by making rapid requests

### Using curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Create Todo (use token from login response)
curl -X POST http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test todo","priority":"high"}'

# Get Todos
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Scenarios

✅ **Authentication:**
- Register new user
- Login with valid credentials
- Login with invalid credentials (should fail)
- Access protected route without token (should return 401)
- Access protected route with invalid token (should return 401)

✅ **Todo CRUD:**
- Create todo with all fields
- Create todo with minimum fields
- Get all todos
- Filter todos by status/priority/group
- Update todo fields
- Toggle todo done status
- Delete todo
- Clear completed todos

✅ **Rate Limiting:**
- Make 6 login attempts rapidly (should be blocked on 6th)
- Make 101 API requests rapidly (should be limited)
- Make 21 todo creations rapidly (should be limited)

✅ **Validation:**
- Try to create todo with empty text (should fail)
- Try to create user with invalid email (should fail)
- Try to create user with short password (should fail)

✅ **Error Handling:**
- Request non-existent todo (should return 404)
- Send invalid JSON (should return 400)
- Access other user's todos (should not be visible)

---

## 🔒 Security Features

### 1. Authentication & Authorization
- JWT tokens with expiration (7 days default)
- Password hashing with bcryptjs (10 salt rounds)
- Token verification on every protected route
- Role-based access control

### 2. Rate Limiting
| Endpoint | Limit | Window |
|----------|-------|--------|
| All API routes | 100 requests | 15 minutes |
| Auth endpoints | 5 attempts | 15 minutes |
| Create todo | 20 requests | 15 minutes |

### 3. Security Headers (Helmet)
- XSS protection
- Content Security Policy
- X-Frame-Options (Clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- Referrer-Policy
- Remove X-Powered-By header

### 4. CORS
- Configurable allowed origins
- Credentials support
- Pre-flight request handling

### 5. Input Validation
- Express Validator for all user inputs
- MongoDB schema validation
- Email format validation
- Password strength requirements (min 6 characters)
- Username constraints (3-30 characters, alphanumeric + underscore)

### 6. Data Protection
- Passwords never stored in plain text
- Password field excluded from responses by default
- User data isolation (users can only access their own todos)

### 7. HTTPS Support
- TLS/SSL encryption
- Secure cookie transmission
- Man-in-the-middle attack prevention

---

## 📈 Performance Optimizations

- **Compression:** 60-70% response size reduction
- **MongoDB Indexes:** Optimized queries for userId, done, important, dueDate
- **Response Formatting:** Consistent JSON structure
- **Logging:** Efficient file and console logging with Morgan
- **Connection Pooling:** MongoDB connection reuse

---

## 🏗️ Architecture & Design Patterns

### MVC (Model-View-Controller)
- **Models:** Define data structure and business rules (Mongoose schemas)
- **Controllers:** Handle business logic and data manipulation
- **Routes:** Map HTTP endpoints to controllers

### Middleware Chain
```
Request
  ↓
Helmet (Security Headers)
  ↓
CORS (Origin Validation)
  ↓
Compression (Response Size)
  ↓
Morgan (Request Logging)
  ↓
Body Parser (JSON Parsing)
  ↓
Format Response (Wrapper)
  ↓
Rate Limiter (Abuse Prevention)
  ↓
JWT Auth (Token Verification)
  ↓
Validator (Input Validation)
  ↓
Async Handler (Error Catching)
  ↓
Controller (Business Logic)
  ↓
Model (Database)
  ↓
Response (Formatted JSON)
```

### Error Handling Strategy
1. **Async Handler:** Catches async errors automatically
2. **Validation Errors:** Returns 400 with field-specific errors
3. **Authentication Errors:** Returns 401 for invalid/missing tokens
4. **Authorization Errors:** Returns 403 for insufficient permissions
5. **Not Found Errors:** Returns 404 for missing resources
6. **Rate Limit Errors:** Returns 429 with retry information
7. **Server Errors:** Returns 500 with error message (stack in development)

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js 16+ |
| **Framework** | Express.js 4.21 |
| **Database** | MongoDB 8.0 with Mongoose 8.20 |
| **Authentication** | JSON Web Token (JWT), bcryptjs |
| **Security** | Helmet, CORS, express-rate-limit |
| **Validation** | express-validator |
| **Logging** | Morgan |
| **Performance** | compression |
| **Environment** | dotenv |
| **Development** | nodemon |

---

## 👩‍💻 Author

**Arefeh Zarabian**

- Student ID: 40134693
- Email: z.arefeh.za@gmail.com
- GitHub: [@Irene-03](https://github.com/Irene-03)
- Repository: [todo-list-app](https://github.com/Irene-03/todo-list-app)

---

## 📚 Documentation

### 📖 Technical Guides (in `docs/` folder)
- **[MONGODB_SETUP.md](./docs/MONGODB_SETUP.md)** - MongoDB installation (Local + Atlas)
- **[MONGODB_ATLAS_SETUP.md](./docs/MONGODB_ATLAS_SETUP.md)** - Quick Atlas setup (Persian)
- **[SSL_SETUP.md](./docs/SSL_SETUP.md)** - SSL certificate generation
- **[DOCKER_GUIDE.md](./docs/DOCKER_GUIDE.md)** - Complete Docker guide
- **[API_TESTING_GUIDE.md](./docs/API_TESTING_GUIDE.md)** - API testing with Postman

### 📊 Project Reports (in `reports/` folder)
- **[PHASE1_REPORT.html](./reports/PHASE1_REPORT.html)** - Phase 1 report (Frontend)
- **[PHASE3_REPORT.html](./reports/PHASE3_REPORT.html)** - Phase 3 report (with screenshots)
- **[PROJECT_FULL_REPORT.html](./reports/PROJECT_FULL_REPORT.html)** - Complete project report

### 📸 Screenshots
- Available in `screenshots/` folder
- Guide: `http://localhost:3000/screenshots-guide.html`

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Internet Engineering Course Project
- Express.js Documentation
- MongoDB University
- JWT.io
- Node.js Best Practices

---

## 📚 Additional Resources

- [MongoDB Setup Guide](./MONGODB_SETUP.md)
- [SSL Certificate Generation](./SSL_SETUP.md)
- [API Testing Guide](./API_TESTING_GUIDE.md)
- [Complete Technical Report](./PROJECT_REPORT.html)
- [Phase 1 Report](./PHASE1_REPORT.html)
- [Phase 3 Report](./PHASE3_REPORT.html)

---

<div align="center">

**Built with ❤️ for learning modern web development**

⭐ Star this repo if you find it helpful!

</div>
