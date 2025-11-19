# API Testing Guide - Phase 3

## Prerequisites
- Server running on `http://localhost:3000`
- MongoDB connected
- Postman or similar API testing tool

## 1. Register New User

**Endpoint:** `POST /api/auth/register`

**Body (JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "6563f8a2b1c4d5e6f7a8b9c0",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "createdAt": "2025-11-19T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-11-19T..."
}
```

**Save the token for subsequent requests!**

---

## 2. Login

**Endpoint:** `POST /api/auth/login`

**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "6563f8a2b1c4d5e6f7a8b9c0",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "lastLogin": "2025-11-19T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-11-19T..."
}
```

---

## 3. Get Current User Profile

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "6563f8a2b1c4d5e6f7a8b9c0",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "createdAt": "2025-11-19T...",
      "lastLogin": "2025-11-19T..."
    }
  },
  "timestamp": "2025-11-19T..."
}
```

---

## 4. Create Todo (Authenticated)

**Endpoint:** `POST /api/todos`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "text": "Complete Phase 3 project",
  "description": "Implement MongoDB, JWT, and rate limiting",
  "priority": "high",
  "important": true,
  "dueDate": "2025-11-25",
  "groups": ["university", "web-engineering"]
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "6563f8a2b1c4d5e6f7a8b9c1",
    "text": "Complete Phase 3 project",
    "description": "Implement MongoDB, JWT, and rate limiting",
    "done": false,
    "important": true,
    "priority": "high",
    "dueDate": "2025-11-25T00:00:00.000Z",
    "groups": ["university", "web-engineering"],
    "userId": "6563f8a2b1c4d5e6f7a8b9c0",
    "createdAt": "2025-11-19T...",
    "updatedAt": "2025-11-19T..."
  },
  "timestamp": "2025-11-19T..."
}
```

---

## 5. Get All Todos (Authenticated)

**Endpoint:** `GET /api/todos`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Query Parameters (optional):**
- `status=completed` or `status=uncompleted`
- `important=true`
- `priority=high|normal|low`
- `search=keyword`
- `group=university`

**Example:** `GET /api/todos?status=uncompleted&important=true`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6563f8a2b1c4d5e6f7a8b9c1",
      "text": "Complete Phase 3 project",
      "done": false,
      "important": true,
      "priority": "high",
      ...
    }
  ],
  "count": 1,
  "timestamp": "2025-11-19T..."
}
```

---

## 6. Update Todo (Toggle Done)

**Endpoint:** `PUT /api/todos/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "action": "toggle"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6563f8a2b1c4d5e6f7a8b9c1",
    "text": "Complete Phase 3 project",
    "done": true,
    "completedAt": "2025-11-19T...",
    ...
  },
  "timestamp": "2025-11-19T..."
}
```

---

## 7. Update Todo (Edit Fields)

**Endpoint:** `PUT /api/todos/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "text": "Complete Phase 3 project - UPDATED",
  "priority": "normal",
  "description": "Updated description"
}
```

---

## 8. Delete Todo

**Endpoint:** `DELETE /api/todos/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:** `204 No Content`

---

## 9. Get Todos Statistics

**Endpoint:** `GET /api/todos/stats`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
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
  },
  "timestamp": "2025-11-19T..."
}
```

---

## 10. Clear Completed Todos

**Endpoint:** `DELETE /api/todos/completed`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Completed todos cleared",
    "deletedCount": 5
  },
  "timestamp": "2025-11-19T..."
}
```

---

## Error Scenarios to Test

### 1. Unauthorized (No Token)
**Request:** Any authenticated endpoint without Authorization header

**Expected Response (401):**
```json
{
  "success": false,
  "error": {
    "message": "Access denied. No token provided.",
    "status": 401
  },
  "timestamp": "2025-11-19T..."
}
```

### 2. Invalid Token
**Request:** Endpoint with invalid or expired token

**Expected Response (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid token.",
    "status": 401
  },
  "timestamp": "2025-11-19T..."
}
```

### 3. Validation Error
**Request:** `POST /api/todos` with empty text

**Expected Response (400):**
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
  "timestamp": "2025-11-19T..."
}
```

### 4. Rate Limit Exceeded
**Request:** Make more than 5 login attempts in 15 minutes

**Expected Response (429):**
```json
{
  "success": false,
  "error": {
    "message": "Too many authentication attempts from this IP, please try again after 15 minutes.",
    "status": 429,
    "retryAfter": "15 minutes"
  },
  "timestamp": "2025-11-19T..."
}
```

### 5. Resource Not Found
**Request:** `GET /api/todos/invalid-id`

**Expected Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Todo not found",
    "status": 404
  },
  "timestamp": "2025-11-19T..."
}
```

---

## Postman Collection

Create a new collection and add these requests with saved variables:
- `baseUrl`: `http://localhost:3000`
- `token`: (will be set after login)

Use `{{baseUrl}}` and `{{token}}` in your requests.

---

## Testing Rate Limiting

1. **General API Rate Limit:** 100 requests per 15 minutes
2. **Auth Rate Limit:** 5 failed login attempts per 15 minutes
3. **Create Todo Rate Limit:** 20 todos per 15 minutes

To test, make rapid requests and observe 429 responses.
