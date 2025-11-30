# 🚀 راهنمای سریع دستورات CURL

## MongoDB Basic Mode

### راه‌اندازی سرور:
```powershell
$env:LEARNING_MODE='mongo-basic'
node app.js
```

### دستورات CRUD:

#### 1. CREATE
```powershell
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d "{\"title\":\"Buy milk\"}"
```

#### 2. READ
```powershell
curl http://localhost:3000/todos
```

#### 3. UPDATE
```powershell
curl -X PUT http://localhost:3000/todos/[ID] -H "Content-Type: application/json" -d "{\"title\":\"Buy eggs\",\"completed\":true}"
```

#### 4. DELETE
```powershell
curl -X DELETE http://localhost:3000/todos/[ID]
```

---

## Redis Basic Mode

### راه‌اندازی سرور:
```powershell
$env:LEARNING_MODE='redis-basic'
node app.js
```

### دستورات CRUD:

#### 1. CREATE
```powershell
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d "{\"title\":\"Learn Redis\"}"
```

#### 2. READ
```powershell
curl http://localhost:3000/todos
```

#### 3. UPDATE
```powershell
curl -X PUT http://localhost:3000/todos/1 -H "Content-Type: application/json" -d "{\"title\":\"Master Redis\",\"completed\":true}"
```

#### 4. DELETE
```powershell
curl -X DELETE http://localhost:3000/todos/1
```

---

## Performance Tests

```powershell
# MongoDB Performance Test
node compare-performance/mongo_test.js

# Redis Performance Test
node compare-performance/redis_test.js
```

---

## نکات مهم:

1. از `^` در پایان خط برای ادامه دستور در ویندوز استفاده کنید
2. از `\"` به جای `'` در JSON استفاده کنید
3. ID را از خروجی CREATE کپی کنید
4. سرور باید در حال اجرا باشد
5. MongoDB و Redis باید نصب و running باشند
