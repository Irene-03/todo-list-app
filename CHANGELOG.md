# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-11-20

### Added
- ✅ Complete JWT Authentication system with login/register
- ✅ "Keep me logged in" functionality (localStorage vs sessionStorage)
- ✅ Secure token storage and transmission
- ✅ User-specific data isolation
- ✅ Logout functionality with clean session management
- ✅ Welcome landing page at root (/)
- ✅ Protected dashboard route (/dashboard)
- ✅ Comprehensive authentication flow debugging
- ✅ Docker development configuration (docker-compose.dev.yml)
- ✅ MongoDB Express UI for database management (dev mode)
- ✅ Enhanced npm scripts for Docker operations
- ✅ Screenshots section in PHASE3_REPORT.html
- ✅ Cache-busting for frontend assets

### Changed
- 📝 Report title changed from "Phase 3" to "Phase 2"
- 🔄 Simplified authentication code (removed excessive console.logs)
- 🔄 Improved token persistence with proper storage management
- 🔄 Better redirect handling with window.location.href
- 🔄 Enhanced .dockerignore patterns
- 🔄 Updated README.md with Docker commands

### Fixed
- 🐛 Fixed JWT token not being sent with API requests
- 🐛 Fixed redirect loop after login/register
- 🐛 Fixed token storage timing issues
- 🐛 Fixed browser cache issues with version parameter
- 🐛 Fixed authentication check on page load
- 🐛 Fixed logout not clearing all storage
- 🐛 Fixed auto-redirect conflict in auth.html

### Security
- 🔒 Proper token validation on backend
- 🔒 Secure password hashing with bcrypt
- 🔒 Token expiration (7 days default)
- 🔒 Protected API endpoints with authenticateToken middleware

## [1.0.0] - Previous Version

### Phase 3 Features
- MongoDB integration with Mongoose
- JWT Authentication backend
- Rate Limiting (3-tier)
- HTTPS Support
- MVC Architecture
- Docker Support
- Security middlewares (Helmet, CORS)
- Validation with express-validator
- Error handling middleware
- API documentation

### Phase 2 Features
- SQLite database
- Basic authentication
- Middleware setup
- Logging with Morgan
- Compression

### Phase 1 Features
- Basic Express.js setup
- RESTful API
- In-memory storage
- CRUD operations
