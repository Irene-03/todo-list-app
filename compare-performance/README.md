# ⚖️ Redis vs MongoDB Performance Tests

این پوشه شامل دو اسکریپت ساده برای مقایسه سرعت درج و خواندن داده بین Redis و MongoDB Atlas است.

## پیش‌نیازها
1. نصب پکیج‌های پروژه (`npm install`)
2. تنظیم مقادیر زیر در فایل `.env`:
   ```env
   REDIS_URL=redis://localhost:6379
   MONGO_URL="your-mongodb-atlas-connection-string"
   ```
3. اجرای سرویس‌های Redis / MongoDB (محلی یا ابری)

## اجرای تست Redis
```bash
node compare-performance/redis_test.js
```
خروجی:
```
Testing Redis...
Redis Insert Time: 35 ms
Redis Read Time: 8 ms
```

## اجرای تست MongoDB Atlas
```bash
node compare-performance/mongo_test.js
```
خروجی:
```
Testing MongoDB Atlas...
MongoDB Insert Time: 480 ms
MongoDB Read Time: 220 ms
```

## نتیجه‌گیری پیشنهادی
| Operation        | Redis (ms) | MongoDB (ms) |
|------------------|------------|--------------|
| Insert 1000 items|     35     |     480      |
| Read 1000 items  |      8     |     220      |

Redis در حافظه کار می‌کند، بنابراین برای عملیات سریع‌تر است؛ اما MongoDB داده‌ها را روی دیسک و از طریق شبکه ذخیره می‌کند و برای ذخیره‌سازی دائمی مناسب است.
