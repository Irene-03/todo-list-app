# 📋 TODO Dashboard - Professional REST API

## 🎯 Overview

این پروژه یک TODO Management Application حرفه‌ای است که با استفاده از Express.js، SQLite، و یک stack کامل از security و performance middlewares پیاده‌سازی شده است.

## ✨ Phase 1 Features
- ✅ RESTful API with Express.js
- ✅ CRUD operations for todos
- ✅ Task filtering and search
- ✅ Priority levels (low, normal, high)
- ✅ Important tasks marking
- ✅ Groups/Directories organization
- ✅ Modern UI with calendar and weather widget

## 🚀 Phase 2 Enhancements
- ✅ **SQLite Database** - Persistent data storage with better-sqlite3
- ✅ **CORS** - Cross-Origin Resource Sharing with configurable origins
- ✅ **Helmet** - Security headers (XSS, Clickjacking, MIME-Sniffing protection)
- ✅ **Morgan** - Professional HTTP request logging to file and console
- ✅ **Compression** - Response compression for improved performance
- ✅ **Express Validator** - Input validation with detailed error messages
- ✅ **Standard Response Format** - Consistent API responses with success/error structure
- ✅ **Async Error Handling** - Clean error management without try/catch blocks

## 📦 Installation

```bash
# Install dependencies
npm install

# Create .env file (optional - defaults provided)
PORT=3000
API_KEY=your-secret-api-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Start server
npm run dev
```

## 🚀 Usage

The server will start on `http://localhost:3000`

### API Endpoints

#### Get All Todos
```
GET /api/todos?status=all&search=
```

#### Create Todo
```
POST /api/todos
Content-Type: application/json

{
  "text": "Task title",
  "description": "Task description",
  "priority": "high",
  "important": true,
  "dueDate": "2025-12-31T23:59:59Z",
  "groups": ["Work", "Urgent"]
}
```

#### Update Todo
```
PUT /api/todos/:id
Content-Type: application/json

{
  "text": "Updated title",
  "done": true
}
```

#### Delete Todo
```
DELETE /api/todos/:id
```

#### Get Statistics
```
GET /api/todos/stats
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-11-15T12:00:00Z"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "status": 400,
    "details": [
      {
        "field": "text",
        "msg": "Task text is required"
      }
    ]
  },
  "timestamp": "2025-11-15T12:00:00Z"
}
```

## 🔒 Security Features

1. **Helmet** - Sets secure HTTP headers
   - Prevents XSS attacks
   - Disables MIME type sniffing
   - Prevents clickjacking

2. **CORS** - Controls cross-origin access
   - Configurable allowed origins via .env
   - Credentials support

3. **Input Validation** - Protects against injection attacks
   - Text length limits (1-500 chars for title, max 2000 for description)
   - Type validation for all fields
   - Sanitization of user input

## 📊 Logging

Logs are written to:
- **Console** - Development-friendly format
- **access.log** - Combined Apache format for production

## 🗄️ Database

SQLite database (`todos.db`) with three tables:
- `todos` - Task information
- `directories` - Group/directory names
- `todo_directories` - Many-to-many relationships

## 🧪 Testing

### Valid Request Example
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Test Task", "priority": "high"}'
```

### Invalid Request Example (triggers validation)
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "", "priority": "invalid"}'
```

### CORS Test
```bash
curl -X GET http://localhost:3000/api/todos \
  -H "Origin: http://unauthorized-domain.com"
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| API_KEY | API authentication key | - |
| ALLOWED_ORIGINS | Comma-separated CORS origins | http://localhost:3000 |
| NODE_ENV | Environment mode | development |

## 🔧 Development

The application now includes:
- Hot reload with nodemon
- Detailed error logging
- SQLite database persistence
- Professional middleware stack

## 📄 License

MIT
