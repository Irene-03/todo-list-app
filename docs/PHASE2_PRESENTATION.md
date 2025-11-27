# Phase 2 Presentation Outline

> 10-slide deck for classroom presentation (5–7 minutes)

## Slide 1 – Title & Context
- Project name, student info, course & phase number
- هدف کلی فاز دوم (ارتقاء به سطح Production)

## Slide 2 – معماری کلی
- نمودار MVC + MongoDB
- اشاره به Docker و ساختار فولدرها

## Slide 3 – Stack & Dependencies
- لیست ابزارهای جدید: cors, helmet, morgan, compression, express-validator
- نسخه Node/Express و MongoDB

## Slide 4 – جریان درخواست
- دیاگرام Request → Middleware Chain → Response
- توضیح نقش Request Timeout و API Key Guard

## Slide 5 – امنیت چندلایه
- JWT + API Key + Rate Limiter
- Helmet, CORS، HTTPS

## Slide 6 – اعتبارسنجی و فرمت پاسخ
- express-validator rules (auth/todo)
- formatResponse و ساختار success/error JSON

## Slide 7 – لاگ‌گیری و مانیتورینگ
- Morgan + access.log نمونه خروجی
- اشاره به nodemon و npm scripts

## Slide 8 – Docker & DevOps
- docker-compose (app + mongodb + mongo-express dev)
- اسکرین‌شات داشبورد و کانتینرها

## Slide 9 – آزمون‌ها و دمو
- سناریوهای تست الزامی (API key, CORS, Validation, Rate Limit, Success)
- ذکر ابزار Postman / Thunder Client

## Slide 10 – جمع‌بندی و گام بعد
- وضعیت کنونی (Ready for Production)
- پیشنهادهای فاز بعدی (JWT refresh, Observability, Elastic Stack)
