# 📁 Project Structure

## 🏗️ ساختار کلی پروژه

```
todo-project-v2.2/
│
├── 📁 config/                    # تنظیمات و کانفیگ‌ها
│   └── database.js              # اتصال MongoDB
│
├── 📁 controllers/               # کنترلرها (MVC Pattern)
│   ├── authController.js        # احراز هویت (register, login, me)
│   └── todoController.js        # عملیات CRUD برای TODO
│
├── 📁 models/                    # مدل‌های Mongoose
│   ├── user.js                  # User Schema (username, email, password, role)
│   └── todo.js                  # Todo Schema (text, done, important, priority, etc.)
│
├── 📁 routes/                    # مسیرهای API
│   ├── auth.js                  # /api/auth/* (register, login, me)
│   └── todos.js                 # /api/todos/* (CRUD operations)
│
├── 📁 middleware/                # Middleware ها
│   ├── authenticateToken.js     # JWT Verification
│   ├── rateLimiter.js           # Rate Limiting (3 tiers)
│   ├── errorHandler.js          # Error Handling
│   ├── logger.js                # Request Logging
│   └── formatResponse.js        # Response Formatting
│
├── 📁 public/                    # Frontend (Static Files)
│   ├── index.html               # صفحه اصلی Dashboard
│   ├── auth.html                # صفحه Login/Register
│   ├── style.css                # استایل‌های UI
│   ├── script.js                # منطق frontend + JWT
│   └── screenshots-guide.html   # راهنمای اسکرین‌شات
│
├── 📁 docs/                      # مستندات فنی
│   ├── README.md                # راهنمای پوشه docs
│   ├── MONGODB_SETUP.md         # نصب MongoDB (Local + Atlas)
│   ├── MONGODB_ATLAS_SETUP.md   # راهنمای سریع Atlas (فارسی)
│   ├── SSL_SETUP.md             # تولید SSL Certificate
│   ├── DOCKER_GUIDE.md          # راهنمای کامل Docker
│   ├── API_TESTING_GUIDE.md     # تست API با Postman/curl
│   └── README_PHASE2.md         # مستندات فاز 2
│
├── 📁 reports/                   # گزارش‌های HTML
│   ├── README.md                # راهنمای پوشه reports
│   ├── PHASE1_REPORT.html       # گزارش فاز 1
│   ├── PHASE3_REPORT.html       # گزارش فاز 3 (با screenshots)
│   └── PROJECT_FULL_REPORT.html # گزارش کلی 3 فاز
│
├── 📁 screenshots/               # تصاویر پروژه
│   ├── README.md                # راهنمای اسکرین‌شات‌ها
│   ├── 01-login-register.png
│   ├── 02-main-dashboard.png
│   ├── 03-add-todo-modal.png
│   └── ...                      # سایر تصاویر
│
├── 📁 cert/                      # SSL Certificates (اختیاری)
│   ├── key.pem
│   └── cert.pem
│
├── 📁 media/                     # فایل‌های media (اگر وجود دارد)
│
├── 📄 app.js                     # Entry Point اصلی برنامه
├── 📄 package.json               # Dependencies و Scripts
├── 📄 .env                       # متغیرهای محیطی
├── 📄 .gitignore                 # فایل‌های ignore شده
│
├── 📄 Dockerfile                 # Docker Image Configuration
├── 📄 docker-compose.yml         # Docker Compose (Development)
├── 📄 docker-compose.prod.yml    # Docker Compose (Production)
├── 📄 .dockerignore              # فایل‌های ignore در Docker
├── 📄 mongo-init.js              # MongoDB Initialization Script
│
└── 📄 README.md                  # مستندات اصلی پروژه (انگلیسی)
```

---

## 📦 توضیح پوشه‌ها

### ⚙️ Backend Core
- **`config/`** - تنظیمات اتصال دیتابیس و کانفیگ‌های کلی
- **`controllers/`** - منطق business (جدا از routes)
- **`models/`** - Schema های Mongoose برای MongoDB
- **`routes/`** - تعریف endpoint های API
- **`middleware/`** - توابع میانی (auth, logging, error handling)

### 🎨 Frontend
- **`public/`** - تمام فایل‌های استاتیک (HTML, CSS, JS)
  - `index.html` - Dashboard اصلی
  - `auth.html` - صفحه ورود/ثبت‌نام
  - `script.js` - منطق فرانت + مدیریت JWT
  - `style.css` - طراحی UI

### 📚 Documentation
- **`docs/`** - راهنماهای نصب، راه‌اندازی و استفاده
- **`reports/`** - گزارش‌های HTML برای ارائه
- **`screenshots/`** - تصاویر پروژه

### 🐳 Docker
- `Dockerfile` - ساخت image برنامه
- `docker-compose.yml` - orchestration (MongoDB + App)
- `mongo-init.js` - راه‌اندازی اولیه MongoDB

---

## 🔄 Flow اجرای برنامه

```
Client Request
    ↓
app.js (Entry Point)
    ↓
Helmet → CORS → Compression → Morgan
    ↓
Body Parser → Format Response
    ↓
Rate Limiter (API Level)
    ↓
Routes (auth.js or todos.js)
    ↓
JWT Middleware (authenticateToken)
    ↓
Controllers (authController or todoController)
    ↓
Models (User or Todo)
    ↓
MongoDB (Mongoose)
    ↓
Response → Error Handler
    ↓
Client
```

---

## 📊 آمار پروژه

| مورد | تعداد |
|------|-------|
| فایل‌های JavaScript | 12 |
| فایل‌های HTML | 5 |
| فایل‌های Markdown | 8 |
| API Endpoints | 11 |
| Models | 2 |
| Controllers | 2 |
| Middleware | 5 |
| Dependencies | 12 |
| خطوط کد | 2500+ |

---

## 🚀 Quick Start

```bash
# نصب dependencies
npm install

# راه‌اندازی MongoDB (Local یا Atlas)
# سپس .env را تنظیم کنید

# اجرای سرور
npm run dev

# دسترسی به برنامه
http://localhost:3000
```

---

**Project:** TODO Dashboard Phase 3  
**Student:** عارفه ضرابیان (40134693)  
**GitHub:** https://github.com/Irene-03/todo-list-app
