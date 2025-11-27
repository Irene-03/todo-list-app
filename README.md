# 📋 TODO Dashboard - Express.js با میان‌افزارهای پیشرفته

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express.js](https://img.shields.io/badge/Express.js-4.21-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-brightgreen.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![Phase](https://img.shields.io/badge/Phase-2%20Complete-success.svg)

**پروژه درس مهندسی اینترنت - TODO API با میان‌افزارهای حرفه‌ای**

[نصب سریع](#-نصب-سریع) • [فیچرها](#-ویژگی‌های-فاز-دوم) • [API](#-api-endpoints) • [Docker](#-اجرا-با-docker) • [گزارش‌ها](#-گزارش‌ها)

</div>

---

## 🎯 پروژه نهایی درس مهندسی اینترنت

**دانشجو:** عارفه ضرابیان (40134693)  
**ایمیل:** z.arefeh.za@gmail.com  
**GitHub:** [Irene-03/todo-list-app](https://github.com/Irene-03/todo-list-app)

### 📊 وضعیت فازها:
- ✅ **فاز 1:** REST API پایه با حافظه داخلی
- ✅ **فاز 2:** میان‌افزارهای پیشرفته (CORS, Helmet, Morgan, Compression, Validation)
- ✅ **فاز 3:** MongoDB, JWT Authentication, Rate Limiting, Docker

---

## 🚀 ویژگی‌های فاز دوم

### 🛡️ میان‌افزارهای امنیتی
- **🔒 Helmet:** محافظت از XSS، Clickjacking، MIME Sniffing
- **🌐 CORS:** کنترل دسترسی Cross-Origin با تنظیمات پیشرفته
- **⚡ Rate Limiting:** محدودسازی درخواست (3 سطح مختلف)
- **🔑 API Key:** احراز هویت با کلید API برای تمام endpoints

### 📊 بهینه‌سازی و عملکرد
- **🗜️ Compression:** فشرده‌سازی پاسخ‌ها (60% کاهش حجم)
- **📝 Morgan:** لاگ‌گیری حرفه‌ای (فایل + کنسول)
- **⏱️ Request Timeout:** محدودیت زمانی 10 ثانیه‌ای
- **🎨 Response Formatting:** قالب استاندارد JSON

### 🗄️ پایگاه داده و احراز هویت
- **🍃 MongoDB:** جایگزین SQLite با Mongoose ODM
- **🔐 JWT:** سیستم Token-based authentication  
- **🔒 bcryptjs:** رمزگذاری امن پسوردها
- **👤 User Management:** ثبت‌نام، ورود، مدیریت کاربر

---

## 🚀 نصب سریع

### پیش‌نیازها
- Node.js 18+
- MongoDB (محلی یا Atlas)
- Git

### دستورات نصب
```bash
# کلون کردن پروژه
git clone https://github.com/Irene-03/todo-list-app.git
cd todo-list-app

# نصب وابستگی‌ها
npm install

# تنظیم متغیرهای محیطی
cp .env.example .env
# ویرایش فایل .env

# اجرای پروژه
npm run dev
```

**🌐 دسترسی:** http://localhost:3000

---

## 🐳 اجرا با Docker

### شروع سریع
```bash
# اجرای کامل سیستم
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f app

# توقف سیستم
docker-compose down
```

### محیط توسعه (با Mongo Express)
```bash
# اجرا با رابط مدیریت MongoDB
docker-compose --profile dev up -d

# دسترسی به Mongo Express: http://localhost:8081
```

### دستورات مفید Docker
```bash
# ساخت مجدد image
docker-compose build --no-cache

# پاک‌سازی volumes
docker-compose down -v

# مشاهده وضعیت سرویس‌ها
docker-compose ps
```

---

## 📡 API Endpoints

### 🔐 احراز هویت
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### 📝 مدیریت TODO
```http
GET    /api/todos           # دریافت لیست
POST   /api/todos           # ایجاد جدید
GET    /api/todos/:id       # دریافت یکی
PUT    /api/todos/:id       # بروزرسانی
DELETE /api/todos/:id       # حذف
DELETE /api/todos/completed # حذف تمام انجام شده‌ها
GET    /api/todos/stats     # آمار
```

### نمونه درخواست
```bash
# ثبت‌نام
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: your-api-key" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'

# ایجاد TODO
curl -X POST http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: your-api-key" \
  -d '{"text":"تست TODO","priority":"high"}'
```

---

## 🛠️ تکنولوژی‌های استفاده شده

| دسته | تکنولوژی |
|------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 4.21.0 |
| **Database** | MongoDB 8.0 + Mongoose 8.20.0 |
| **Security** | Helmet, CORS, Rate Limiter |
| **Validation** | express-validator 7.3.0 |
| **Logging** | Morgan 1.10.1 |
| **Performance** | Compression 1.8.1 |
| **Auth** | JWT, bcryptjs |
| **Container** | Docker + Compose |

---

## 🧪 تست‌های فاز دوم

### ✅ تست‌های اجباری
1. **API Key Validation** - بررسی عدم دسترسی بدون کلید
2. **CORS Protection** - تست محدودیت origin
3. **Input Validation** - تست اعتبارسنجی ورودی‌ها  
4. **Rate Limiting** - تست محدودسازی درخواست
5. **Standard Response** - تست قالب JSON استاندارد

### نتایج تست
🖼️ **تصاویر تست:** مشاهده فایل‌های `ex(3).png` تا `ex(7).png` در پوشه `media/`

---

## 📊 گزارش‌ها

### 📋 گزارش‌های HTML
- **[گزارش فاز دوم کامل](./reports/PHASE2_COMPLETE_REPORT.html)** - گزارش جامع با تصاویر
- **[خلاصه پیاده‌سازی](./reports/PHASE2_IMPLEMENTED_SUMMARY.html)** - خلاصه اجرا شده
- **[گزارش تکنیکی کامل](./reports/PROJECT_FULL_REPORT.html)** - مستندات کامل

### 🔍 جزئیات میان‌افزارها
| میان‌افزار | وضعیت | توضیح |
|------------|-------|--------|
| **Helmet** | ✅ فعال | Security headers |
| **CORS** | ✅ فعال | Dynamic origins از .env |
| **Morgan** | ✅ فعال | File + Console logging |
| **Compression** | ✅ فعال | Response compression |
| **express-validator** | ✅ فعال | Input validation |
| **formatResponse** | ✅ فعال | Standard JSON wrapper |
| **apiKeyAuth** | ✅ فعال | X-API-KEY validation |
| **requestTimeout** | ✅ فعال | 10s timeout |
| **rateLimiter** | ✅ فعال | 3-tier limiting |
| **asyncHandler** | ✅ فعال | Async error handling |

---

## 🏗️ ساختار پروژه

```
todo-project-v2.2/
│
├── 📁 middleware/           # میان‌افزارهای سفارشی
│   ├── apiKeyAuth.js        # احراز هویت API Key
│   ├── formatResponse.js    # قالب‌بندی پاسخ
│   ├── requestTimeout.js    # مدیریت timeout
│   ├── rateLimiter.js       # محدودسازی درخواست
│   ├── asyncHandler.js      # مدیریت async errors
│   └── errorHandler.js      # مدیریت خطاها
│
├── 📁 controllers/          # کنترلرها
│   ├── authController.js    # منطق احراز هویت
│   └── todoController.js    # منطق CRUD
│
├── 📁 models/              # مدل‌های دیتابیس
│   ├── user.js             # مدل کاربر
│   └── todo.js             # مدل TODO
│
├── 📁 routes/              # مسیرهای API
│   ├── auth.js             # مسیرهای احراز هویت
│   └── todos.js            # مسیرهای TODO
│
├── 📁 public/              # فایل‌های فرانت‌اند
│   ├── index.html          # صفحه اصلی
│   ├── auth.html           # صفحه ورود/ثبت‌نام
│   ├── script.js           # منطق جاوااسکریپت
│   └── style.css           # استایل‌ها
│
├── 📁 reports/             # گزارش‌های HTML
├── 📁 media/               # تصاویر تست
├── app.js                  # فایل اصلی برنامه
├── .env                    # تنظیمات محیطی
├── Dockerfile              # Docker image
├── docker-compose.yml      # Docker orchestration
└── package.json            # وابستگی‌ها
```

---

## 🎯 تحویلی‌های نهایی فاز دوم

### ✅ موارد تحویلی
- [x] **کد پروژه** - تمام فایل‌های بروزرسانی شده
- [x] **گزارش HTML** - مستندات کامل با تصاویر
- [x] **تصاویر تست** - نتایج 5 تست الزامی
- [x] **Docker Setup** - آماده برای اجرا
- [x] **API Documentation** - راهنمای کامل استفاده

### 🎓 اطلاعات دانشجو
**نام:** عارفه ضرابیان  
**شماره دانشجویی:** 40134693  
**ایمیل:** z.arefeh.za@gmail.com  
**GitHub:** https://github.com/Irene-03/todo-list-app  
**تاریخ تحویل:** 27 آذر 1403

---

## 📞 پشتیبانی

در صورت بروز مشکل:
- **Issues:** [GitHub Issues](https://github.com/Irene-03/todo-list-app/issues)
- **ایمیل:** z.arefeh.za@gmail.com
- **مستندات:** مشاهده فایل‌های `reports/`

---

<div align="center">

**🎓 ساخته شده با ❤️ برای درس مهندسی اینترنت**

⭐ اگر پروژه را پسندیدید، ستاره دهید!

**Phase 2 Complete** | **Advanced Express Middlewares** | **Production Ready**

</div>

### 🗄️ پایگاه داده و احراز هویت
- **🍃 MongoDB:** جایگزین SQLite با Mongoose ODM
- **🔐 JWT:** سیستم Token-based authentication
- **🔒 bcryptjs:** رمزگذاری امن پسوردها
- **👤 User Management:** ثبت‌نام، ورود، مدیریت کاربر

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
