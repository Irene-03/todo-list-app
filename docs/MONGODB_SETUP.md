# MongoDB Installation Guide

## Windows Installation

### Method 1: MongoDB Community Server (Local)

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Download the MSI installer

2. **Install MongoDB:**
   ```powershell
   # Run the installer and choose "Complete" installation
   # Check "Install MongoDB as a Service"
   ```

3. **Verify Installation:**
   ```powershell
   mongod --version
   mongo --version
   ```

4. **Start MongoDB Service:**
   ```powershell
   # MongoDB should start automatically as a service
   # Or manually start:
   net start MongoDB
   ```

5. **Update .env file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/todo-app
   ```

### Method 2: MongoDB Atlas (Cloud - Recommended for Development)

1. **Create Free Account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create a Cluster:**
   - Choose "Shared" (Free tier)
   - Select a cloud provider and region close to you
   - Click "Create Cluster"

3. **Setup Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set privileges to "Read and write to any database"

4. **Setup Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development, choose "Allow Access from Anywhere" (0.0.0.0/0)

5. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env file:**
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todo-app?retryWrites=true&w=majority
   ```

## Verify Connection

```powershell
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database: todo-app
```

## Troubleshooting

### Connection Timeout
- Check if MongoDB service is running
- Verify MONGODB_URI in .env is correct
- Check firewall settings

### Authentication Failed
- Verify username and password
- Check user has correct permissions

### Network Error
- For Atlas: Check IP whitelist
- For local: Check MongoDB is listening on port 27017

## Alternative: Use Docker

```powershell
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo

# Update .env
MONGODB_URI=mongodb://localhost:27017/todo-app
```
