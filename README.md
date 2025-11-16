# 📋 TODO Dashboard - Professional REST API

<div align="center">

![TODO Dashboard](https://img.shields.io/badge/TODO-Dashboard-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**یک TODO Management Application حرفه‌ای با معماری MVC**

[✨ Features](#-features) •
[🚀 Quick Start](#-quick-start) •
[📡 API](#-api-endpoints) •
[📊 Report](PROJECT_REPORT.html) •
[🤝 Contributing](#-contributing)

</div>

---

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400/667eea/ffffff?text=TODO+Dashboard+UI" alt="Dashboard">
  <p><i>Modern and Responsive User Interface</i></p>
</div>

## 🚀 Quick Start

```bash
# نصب dependencies
npm install

# اجرای سرور
npm run dev

# مرورگر را باز کنید
http://localhost:3000
```

## ✨ Features

### Frontend
- ✅ رابط کاربری مدرن و responsive
- ✅ مدیریت تسک‌ها با drag & drop
- ✅ فیلتر و جستجو
- ✅ ویجت تقویم و آب و هوا
- ✅ حالت نمایش Grid/List
- ✅ حذف دسته‌جمعی

### Backend (Phase 2)
- ✅ **SQLite Database** - ذخیره‌سازی persistent
- ✅ **CORS** - کنترل دسترسی دامنه‌ها
- ✅ **Helmet** - هدرهای امنیتی
- ✅ **Morgan** - لاگ حرفه‌ای HTTP
- ✅ **Compression** - فشرده‌سازی پاسخ‌ها
- ✅ **Express Validator** - اعتبارسنجی ورودی
- ✅ **Standard Response Format** - فرمت یکپارچه JSON
- ✅ **Async Error Handling** - مدیریت خطاهای async

## 📁 Project Structure

```
todo-project-v2.2/
├── models/           # Database & Data Layer
├── routes/           # API Routes
├── middleware/       # Custom Middlewares
├── public/           # Frontend Files
├── app.js            # Main Entry Point
├── .env              # Environment Variables
└── PROJECT_REPORT.html  # 📊 گزارش کامل فنی
```

## 📊 Documentation

**گزارش کامل فنی پروژه:**
- باز کردن فایل `PROJECT_REPORT.html` در مرورگر
- شامل: معماری، نمودارها، API Examples، لاگ‌ها، و تست‌ها

## 🔧 Configuration

فایل `.env`:
```env
PORT=3000
API_KEY=your-secret-api-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | دریافت لیست تسک‌ها |
| POST | `/api/todos` | ایجاد تسک جدید |
| PUT | `/api/todos/:id` | به‌روزرسانی تسک |
| DELETE | `/api/todos/:id` | حذف تسک |
| DELETE | `/api/todos` | حذف تسک‌های تکمیل شده |
| GET | `/api/todos/stats` | آمار تسک‌ها |

## 🧪 Testing

```bash
# تست با curl
curl http://localhost:3000/api/todos

# ایجاد تسک
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Test Task", "priority": "high"}'
```

## 🛡️ Security Features

- ✅ Helmet Headers (XSS, Clickjacking Protection)
- ✅ CORS Policy
- ✅ Input Validation & Sanitization
- ✅ SQL Injection Prevention (Prepared Statements)
- ✅ Error Stack Traces Hidden in Production

## 📈 Performance

- ⚡ Response Time: 2-15ms
- 🗜️ Compression: 60-70% size reduction
- 💾 Persistent Storage with SQLite
- 📝 Access Logs in `access.log`

## 🎨 Frontend Features

- 📅 تقویم تعاملی با انتخاب تاریخ
- 🌤️ ویجت آب و هوا با API واقعی
- 🎯 دسته‌بندی تسک‌ها
- ⭐ علامت‌گذاری مهم
- 🔍 جستجو و فیلتر پیشرفته
- 📱 Responsive Design

## 👨‍💻 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite (better-sqlite3)
- **Security:** Helmet, CORS
- **Logging:** Morgan
- **Validation:** Express Validator
- **Optimization:** Compression
- **Frontend:** Vanilla JavaScript, CSS3

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👩‍💻 Author

**عارفه ضرابیان (Arefeh Zarabian)**
- GitHub: [@Irene-03](https://github.com/Irene-03)
- Repository: [todo-list-app](https://github.com/Irene-03/todo-list-app)

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Express.js Team
- SQLite Community
- All open-source contributors

---

<div align="center">
  <p><strong>📊 برای مشاهده گزارش کامل فنی، فایل <a href="PROJECT_REPORT.html">PROJECT_REPORT.html</a> را باز کنید.</strong></p>
  <p>Made with ❤️ by Arefeh Zarabian</p>
  <p>⭐ اگر این پروژه برایتان مفید بود، یک ستاره بدهید!</p>
</div>
