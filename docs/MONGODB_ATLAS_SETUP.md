# 🚀 راهنمای سریع MongoDB Atlas (بدون نیاز به نصب!)

## مزایا
✅ **رایگان** - 512MB فضای رایگان  
✅ **بدون نصب** - فقط اینترنت نیاز دارید  
✅ **سریع** - 5 دقیقه راه‌اندازی  
✅ **حرفه‌ای** - همان چیزی که شرکت‌ها استفاده می‌کنند

---

## مراحل راه‌اندازی (5 دقیقه)

### 1️⃣ ثبت‌نام رایگان
1. برو به: https://www.mongodb.com/cloud/atlas/register
2. Sign up با Google یا ایمیل
3. **مهم:** گزینه "Shared" (رایگان) را انتخاب کن

### 2️⃣ ساخت Cluster
1. پس از ورود، کلیک کن: **"Build a Database"**
2. انتخاب کن: **"M0 Sandbox"** (FREE)
3. Provider: AWS یا Google Cloud (هرکدام نزدیک‌تر به ایران)
4. Region: انتخاب کن **"Frankfurt"** یا **"Mumbai"** (نزدیک‌تر)
5. کلیک: **"Create Cluster"** (2-3 دقیقه صبر کن)

### 3️⃣ ایجاد Database User
1. منوی چپ → **"Database Access"**
2. کلیک: **"Add New Database User"**
3. انتخاب: **"Password"**
4. Username بنویس: `todouser`
5. Password بنویس: `todo123456` (یادداشت کن!)
6. Database User Privileges: **"Read and write to any database"**
7. کلیک: **"Add User"**

### 4️⃣ تنظیم Network Access
1. منوی چپ → **"Network Access"**
2. کلیک: **"Add IP Address"**
3. کلیک: **"Allow Access from Anywhere"**
4. IP: `0.0.0.0/0` (برای development)
5. کلیک: **"Confirm"**

### 5️⃣ گرفتن Connection String
1. برگرد به **"Database"** (منوی چپ)
2. کنار cluster خودت کلیک کن: **"Connect"**
3. انتخاب: **"Connect your application"**
4. Driver: **Node.js**
5. Version: 5.5 or later
6. **کپی کن** connection string:
   ```
   mongodb+srv://todouser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6️⃣ اضافه کردن به پروژه
1. باز کن فایل `.env` در پروژه
2. جایگزین کن:
   ```env
   MONGODB_URI=mongodb+srv://todouser:todo123456@cluster0.xxxxx.mongodb.net/todo-app?retryWrites=true&w=majority
   ```
   **مهم:** `<password>` را با `todo123456` جایگزین کن و `xxxxx` را با ID cluster خودت

3. در قسمت آخر URI، بعد از `mongodb.net/` اضافه کن: `todo-app` (اسم دیتابیس)

---

## ✅ تست اتصال

```powershell
cd "d:\B - University\7-internt engineering\todo-project-v2.2"
npm start
```

باید ببینی:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database: todo-app
✅ HTTP Server running on http://localhost:3000
```

---

## 🔥 اگر خطا دیدی

### خطا: "bad auth Authentication failed"
❌ **مشکل:** پسورد اشتباه است  
✅ **حل:** از همان پسوردی استفاده کن که هنگام ساخت user وارد کردی

### خطا: "querySrv ENOTFOUND"
❌ **مشکل:** Connection string اشتباه است  
✅ **حل:** دوباره از Atlas کپی کن

### خطا: "connection timed out"
❌ **مشکل:** IP مجاز نیست  
✅ **حل:** Network Access → Allow from Anywhere

---

## 📱 مثال Connection String درست

```env
# جایگزین xxxxx با ID cluster خودت
MONGODB_URI=mongodb+srv://todouser:todo123456@cluster0.abc12.mongodb.net/todo-app?retryWrites=true&w=majority
```

---

## 💡 نکات مهم

1. ✅ حتماً `todo-app` را به آخر URI اضافه کن (اسم دیتابیس)
2. ✅ پسورد را بدون `< >` بنویس
3. ✅ اگر پسورد کاراکتر خاص دارد (`@`, `#`, ...) باید encode کنی
4. ✅ برای production، IP خاص سرور را اضافه کن (نه 0.0.0.0/0)

---

## 🎉 بعد از موفقیت

سرور شما حالا به MongoDB cloud متصل است و:
- ✅ داده‌ها persistent هستند
- ✅ از هر جا قابل دسترسی
- ✅ رایگان تا 512MB
- ✅ Backup خودکار

---

## 📊 مشاهده داده‌ها

1. برو به MongoDB Atlas
2. Database → Collections
3. می‌تونی داده‌ها رو ببینی و مدیریت کنی

---

**⏱️ زمان کل: 5 دقیقه**  
**💰 هزینه: رایگان**  
**📦 فضا: 512MB**

---

اگر مشکلی داشتی، بهم بگو تا کمکت کنم! 🚀
