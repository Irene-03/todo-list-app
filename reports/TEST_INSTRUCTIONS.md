# 📋 دستورالعمل تست و آماده‌سازی گزارش

## ✅ کارهایی که انجام شده است:

### 1. پیاده‌سازی کدها
- ✅ `routes/learning.js`: پیاده‌سازی دو مد ساده MongoDB و Redis بدون احراز هویت
- ✅ `compare-performance/mongo_test.js`: اسکریپت تست عملکرد MongoDB
- ✅ `compare-performance/redis_test.js`: اسکریپت تست عملکرد Redis
- ✅ تنظیمات `.env` برای فعال‌سازی مدهای مختلف
- ✅ مسیریابی خودکار در `app.js` برای مدهای learning

### 2. قابلیت‌های پیاده‌سازی شده

#### MongoDB Basic Mode (`LEARNING_MODE=mongo-basic`)
- ✅ POST /todos - ایجاد تسک جدید
- ✅ GET /todos - دریافت همه تسک‌ها
- ✅ PUT /todos/:id - بروزرسانی تسک
- ✅ DELETE /todos/:id - حذف تسک

#### Redis Basic Mode (`LEARNING_MODE=redis-basic`)
- ✅ POST /todos - ایجاد تسک جدید با ID خودکار
- ✅ GET /todos - دریافت همه تسک‌ها
- ✅ PUT /todos/:id - بروزرسانی تسک
- ✅ DELETE /todos/:id - حذف تسک

#### Performance Tests
- ✅ اسکریپت تست درج 1000 آیتم در Redis
- ✅ اسکریپت تست خواندن 1000 آیتم از Redis
- ✅ اسکریپت تست درج 1000 آیتم در MongoDB
- ✅ اسکریپت تست خواندن 1000 آیتم از MongoDB

---

## 📝 کارهایی که شما باید انجام دهید:

### مرحله 1️⃣: نصب و راه‌اندازی MongoDB و Redis

#### MongoDB:
```powershell
# اگر MongoDB نصب نیست، از سایت رسمی دانلود و نصب کنید
# سپس سرویس MongoDB را اجرا کنید
net start MongoDB
```

#### Redis:
```powershell
# برای ویندوز، Redis را دانلود کرده یا از Docker استفاده کنید:
docker run -d -p 6379:6379 redis

# یا از Memurai (نسخه ویندوز Redis):
# دانلود از: https://www.memurai.com/
```

---

### مرحله 2️⃣: تست MongoDB Basic Mode

#### راه‌اندازی سرور:
```powershell
cd "d:\B - University\7-internt engineering\todo-project-v2.2"
$env:LEARNING_MODE='mongo-basic'
node app.js
```

#### تست‌های CRUD با curl در ترمینال دیگر:

**1. CREATE - ایجاد تسک:**
```powershell
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d "{\"title\":\"Buy milk\"}"
```
**خروجی مورد انتظار:**
```json
{"_id":"674bfe8a3d5e4a1234567890","title":"Buy milk","completed":false}
```
**⚠️ ID را کپی کنید برای تست‌های بعدی!**

**2. READ - دریافت همه تسک‌ها:**
```powershell
curl http://localhost:3000/todos
```

**3. UPDATE - بروزرسانی تسک:**
```powershell
# ID_HERE را با ID دریافتی جایگزین کنید
curl -X PUT http://localhost:3000/todos/ID_HERE -H "Content-Type: application/json" -d "{\"title\":\"Buy eggs\",\"completed\":true}"
```

**4. DELETE - حذف تسک:**
```powershell
curl -X DELETE http://localhost:3000/todos/ID_HERE
```

#### 📸 اسکرین‌شات‌های مورد نیاز:
1. خروجی هر 4 دستور curl
2. محتویات collection در MongoDB Compass (اختیاری)

---

### مرحله 3️⃣: تست Redis Basic Mode

#### راه‌اندازی سرور:
```powershell
# ابتدا سرور قبلی را متوقف کنید (Ctrl+C)
cd "d:\B - University\7-internt engineering\todo-project-v2.2"
$env:LEARNING_MODE='redis-basic'
node app.js
```

#### تست‌های CRUD با curl:

**1. CREATE:**
```powershell
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d "{\"title\":\"Learn Redis\"}"
```
**خروجی مورد انتظار:**
```json
{"id":1,"title":"Learn Redis","completed":false,"createdAt":"2024-11-30T..."}
```

**2. READ:**
```powershell
curl http://localhost:3000/todos
```

**3. UPDATE:**
```powershell
curl -X PUT http://localhost:3000/todos/1 -H "Content-Type: application/json" -d "{\"title\":\"Master Redis\",\"completed\":true}"
```

**4. DELETE:**
```powershell
curl -X DELETE http://localhost:3000/todos/1
```

#### 📸 اسکرین‌شات‌های مورد نیاز:
1. خروجی هر 4 دستور curl
2. نتایج در Redis CLI (اختیاری): `redis-cli KEYS todo:*`

---

### مرحله 4️⃣: اجرای تست‌های Performance

#### تست MongoDB:
```powershell
cd "d:\B - University\7-internt engineering\todo-project-v2.2"
node compare-performance/mongo_test.js
```

**خروجی مورد انتظار:**
```
Testing MongoDB Atlas...
MongoDB Insert Time: XXX ms
MongoDB Read Time: YYY ms
MongoDB performance test complete
```

#### تست Redis:
```powershell
node compare-performance/redis_test.js
```

**خروجی مورد انتظار:**
```
Testing Redis...
Redis Insert Time: XXX ms
Redis Read Time: YYY ms
Redis performance test complete
```

#### 📊 نتایج را در جدول زیر یادداشت کنید:

| عملیات | Redis (ms) | MongoDB (ms) |
|--------|-----------|-------------|
| Insert 1000 items | ؟ | ؟ |
| Read 1000 items | ؟ | ؟ |

#### 📸 اسکرین‌شات‌های مورد نیاز:
1. خروجی کامل تست Redis
2. خروجی کامل تست MongoDB

---

## 📄 محتوای گزارش (موارد مورد نیاز)

### بخش 1: معرفی پروژه
- هدف: پیاده‌سازی API ساده با MongoDB و Redis
- تکنولوژی‌های استفاده شده: Node.js, Express, MongoDB, Redis

### بخش 2: MongoDB CRUD Operations
- توضیح کوتاه از MongoDB و نحوه اتصال
- کد اتصال به MongoDB Atlas
- نمونه کد هر 4 عملیات CRUD
- اسکرین‌شات‌های curl commands و خروجی‌ها
- توضیح ساختار JSON در MongoDB

### بخش 3: Redis CRUD Operations
- توضیح کوتاه از Redis و معماری key-value
- کد اتصال به Redis
- نمونه کد هر 4 عملیات CRUD
- اسکرین‌شات‌های curl commands و خروجی‌ها
- توضیح ساختار داده در Redis (todo:id, todo:ids, todo:1, ...)

### بخش 4: مقایسه عملکرد (Performance Comparison)
- جدول نتایج (Insert و Read time)
- نمودار مقایسه‌ای (اختیاری)
- تحلیل نتایج:
  * چرا Redis سریع‌تر است؟ (in-memory)
  * چرا MongoDB کندتر است؟ (disk + network)
  * چه زمانی از Redis استفاده کنیم؟ (cache, session)
  * چه زمانی از MongoDB استفاده کنیم؟ (persistent data)

### بخش 5: یادگیری‌ها (Learning Outcomes)
چک‌لیست موارد یاد گرفته شده:
- ✅ اتصال Node.js به MongoDB Atlas
- ✅ ایجاد و مدیریت Collections
- ✅ عملیات CRUD در MongoDB
- ✅ اتصال Node.js به Redis
- ✅ مدل‌سازی داده در Redis با keys/lists
- ✅ عملیات CRUD در Redis
- ✅ ساخت REST API routes
- ✅ تست API با curl در Windows
- ✅ کار با JSON در HTTP
- ✅ سریال‌سازی JSON در Redis

### بخش 6: کد منبع
- کد کامل `routes/learning.js` (MongoDB و Redis handlers)
- کد کامل `compare-performance/mongo_test.js`
- کد کامل `compare-performance/redis_test.js`
- توضیح هر بخش از کد

### بخش 7: نتیجه‌گیری
- خلاصه پروژه
- تفاوت‌های اصلی MongoDB vs Redis
- پیشنهادات برای پروژه‌های آینده

---

## 🎨 ساختار فایل HTML گزارش

فایل گزارش باید شامل موارد زیر باشد:

```html
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <title>گزارش پروژه - MongoDB و Redis</title>
    <style>
        /* استایل حرفه‌ای با فونت فارسی */
    </style>
</head>
<body>
    <header>
        <h1>گزارش پروژه مهندسی اینترنت</h1>
        <h2>پیاده‌سازی API با MongoDB و Redis</h2>
    </header>
    
    <section id="intro">...</section>
    <section id="mongodb">...</section>
    <section id="redis">...</section>
    <section id="performance">...</section>
    <section id="learning">...</section>
    <section id="code">...</section>
    <section id="conclusion">...</section>
</body>
</html>
```

---

## ✅ چک‌لیست نهایی قبل از تحویل:

- [ ] MongoDB نصب و اجرا شده
- [ ] Redis نصب و اجرا شده
- [ ] تست 4 عملیات CRUD با MongoDB انجام شده
- [ ] تست 4 عملیات CRUD با Redis انجام شده
- [ ] تست‌های Performance اجرا شده
- [ ] اسکرین‌شات‌های تمام curl commands گرفته شده
- [ ] اسکرین‌شات‌های نتایج performance گرفته شده
- [ ] جدول مقایسه تکمیل شده
- [ ] فایل HTML گزارش نوشته شده
- [ ] کدها در GitHub commit شده
- [ ] گزارش بررسی و ویرایش شده

---

## 🆘 رفع مشکلات احتمالی

### خطا: "MongoDB connection failed"
```powershell
# بررسی اجرا بودن MongoDB:
net start MongoDB
```

### خطا: "Redis connection refused"
```powershell
# بررسی اجرا بودن Redis:
redis-cli ping
# باید PONG برگرداند
```

### خطا: "Port 3000 already in use"
```powershell
# متوقف کردن node processes:
Stop-Process -Name node -Force
```

---

**توجه:** پس از اجرای تمام تست‌ها، نتایج را در یک فایل جداگانه ذخیره کنید تا در گزارش HTML استفاده شود.
