# 🐳 Docker Deployment Guide

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Start everything (MongoDB + App)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Stop and remove data
docker-compose down -v
```

**Access:**
- Application: http://localhost:3000
- MongoDB: localhost:27017

---

## Option 2: Docker Only (App + External MongoDB)

### Build Image
```bash
docker build -t todo-app .
```

### Run Container
```bash
# Using local MongoDB
docker run -d \
  --name todo-app \
  -p 3000:3000 \
  -p 3443:3443 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/todo-app \
  -e JWT_SECRET=your-secret-key \
  todo-app

# Using MongoDB Atlas
docker run -d \
  --name todo-app \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo-app \
  -e JWT_SECRET=your-secret-key \
  todo-app
```

---

## Option 3: MongoDB Only in Docker

```bash
# Start MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  -v mongodb_data:/data/db \
  mongo:8.0

# Update .env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/todo-app?authSource=admin

# Run app locally
npm run dev
```

---

## Environment Variables

Create `.env.docker` for production:

```env
NODE_ENV=production
PORT=3000
HTTPS_PORT=3443
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/todo-app?authSource=admin
JWT_SECRET=change-this-to-a-secure-random-string
JWT_EXPIRE=7d
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Docker Commands Reference

### Management
```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View logs
docker logs todo-app

# Follow logs
docker logs -f todo-app

# Stop container
docker stop todo-app

# Start container
docker start todo-app

# Restart container
docker restart todo-app

# Remove container
docker rm todo-app

# Remove image
docker rmi todo-app
```

### Docker Compose
```bash
# Start in background
docker-compose up -d

# Start with rebuild
docker-compose up --build -d

# View logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f app

# Stop services
docker-compose stop

# Start services
docker-compose start

# Restart services
docker-compose restart

# Remove everything
docker-compose down

# Remove with volumes
docker-compose down -v
```

---

## MongoDB Management in Docker

### Access MongoDB Shell
```bash
# Using docker exec
docker exec -it todo-mongodb mongosh

# Or using docker-compose
docker-compose exec mongodb mongosh
```

### MongoDB Commands
```javascript
// Switch to database
use todo-app

// Show collections
show collections

// View users
db.users.find().pretty()

// View todos
db.todos.find().pretty()

// Count documents
db.users.countDocuments()
db.todos.countDocuments()

// Create admin user
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$...",  // hashed password
  role: "admin",
  createdAt: new Date()
})
```

---

## Production Deployment

### 1. Build for Production
```bash
docker build -t your-registry/todo-app:latest .
```

### 2. Push to Registry
```bash
docker push your-registry/todo-app:latest
```

### 3. Deploy on Server
```bash
# Using docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Or using docker run
docker run -d \
  --name todo-app \
  --restart unless-stopped \
  -p 80:3000 \
  -p 443:3443 \
  -e NODE_ENV=production \
  -e MONGODB_URI=$MONGODB_URI \
  -e JWT_SECRET=$JWT_SECRET \
  -v /path/to/cert:/app/cert \
  your-registry/todo-app:latest
```

---

## Health Check

```bash
# Check if app is running
curl http://localhost:3000

# Check MongoDB connection
curl http://localhost:3000/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

---

## Troubleshooting

### App can't connect to MongoDB
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Check MongoDB logs
docker logs todo-mongodb

# Verify network
docker network inspect todo-project-v22_todo-network
```

### Port already in use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /F /PID <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"
```

### Container keeps restarting
```bash
# Check logs
docker logs todo-app

# Check environment variables
docker inspect todo-app | grep -A 20 "Env"
```

---

## Data Persistence

MongoDB data is stored in Docker volume:
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect todo-project-v22_mongodb_data

# Backup volume
docker run --rm \
  -v todo-project-v22_mongodb_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mongodb-backup.tar.gz -C /data .

# Restore volume
docker run --rm \
  -v todo-project-v22_mongodb_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/mongodb-backup.tar.gz -C /data
```

---

## Performance Tips

1. **Use Docker volumes** for database (faster than bind mounts)
2. **Enable MongoDB indexes** (already done in mongo-init.js)
3. **Use production builds** (NODE_ENV=production)
4. **Limit container resources:**
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '0.5'
             memory: 512M
   ```

---

## Security Best Practices

1. ✅ Change default MongoDB credentials
2. ✅ Use strong JWT_SECRET
3. ✅ Enable HTTPS in production
4. ✅ Restrict ALLOWED_ORIGINS
5. ✅ Don't expose MongoDB port in production
6. ✅ Use Docker secrets for sensitive data
7. ✅ Keep images updated

---

Ready to deploy! 🚀
