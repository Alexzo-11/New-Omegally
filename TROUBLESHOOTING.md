# Troubleshooting Guide

This guide helps resolve common issues when setting up and running the Omegally application.

## Common Setup Issues

### 1. Node.js Not Found
**Error:** `'node' is not recognized as an internal or external command`

**Solution:**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation
- Verify installation: `node --version`

### 2. NPM Permission Errors (Mac/Linux)
**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
# Or use a Node version manager like nvm
```

### 3. Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Kill the process using the port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill
```

## Database Issues

### 1. MongoDB Connection Error
**Error:** `MongooseError: The uri parameter to openUri() must be a string`

**Solutions:**
1. Check your `.env` file in `omegally-backend/`
2. Ensure `MONGODB_URI` is set correctly
3. For local MongoDB: `mongodb://localhost:27017/omegally`
4. For MongoDB Atlas: Get connection string from your Atlas dashboard

### 2. MongoDB Not Running (Local Installation)
**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
```bash
# Windows (MongoDB as Service):
net start MongoDB

# macOS (Homebrew):
brew services start mongodb-community

# Linux (systemd):
sudo systemctl start mongod
```

### 3. Authentication Failed (MongoDB Atlas)
**Error:** `Authentication failed`

**Solution:**
- Check username/password in connection string
- Ensure IP address is whitelisted in Atlas
- Verify database user has proper permissions

## Frontend Issues

### 1. API Connection Failed
**Error:** `Network Error` or `CORS error`

**Solutions:**
1. Ensure backend is running on port 5000
2. Check frontend `.env`: `REACT_APP_API_URL=http://localhost:5000/api`
3. Verify backend CORS configuration allows `http://localhost:3000`

### 2. React App Won't Start
**Error:** Various React/webpack errors

**Solutions:**
```bash
# Clear npm cache and node_modules
cd omegally
rm -rf node_modules
npm cache clean --force
npm install
```

### 3. Browser Console Errors
**Error:** `Failed to fetch` or similar API errors

**Solutions:**
1. Open browser dev tools (F12)
2. Check Network tab for failed requests
3. Verify backend API endpoints are responding
4. Check if both servers are running

## Authentication Issues

### 1. JWT Errors
**Error:** `JsonWebTokenError: invalid token`

**Solutions:**
1. Check JWT secrets match between frontend and backend
2. Clear browser localStorage/cookies
3. Verify token hasn't expired

### 2. Login/Registration Not Working
**Solutions:**
1. Check browser console for errors
2. Verify backend user routes are working
3. Test API endpoints with Postman/curl

## Dependency Issues

### 1. Package Installation Fails
**Error:** Various npm install errors

**Solutions:**
```bash
# Update npm
npm install -g npm@latest

# Clear cache
npm cache clean --force

# Delete lockfile and try again
rm package-lock.json
npm install
```

### 2. Version Conflicts
**Error:** Peer dependency warnings

**Solutions:**
1. Check if warnings are actually errors
2. Update dependencies: `npm update`
3. Use `npm install --force` as last resort

## Development Environment

### 1. Environment Variables Not Loading
**Error:** `undefined` values for environment variables

**Solutions:**
1. Ensure `.env` files exist in both directories
2. Check `.env` file format (no spaces around `=`)
3. Restart servers after changing `.env`

### 2. Hot Reload Not Working
**Issue:** Changes don't reflect automatically

**Solutions:**
1. Save files properly (Ctrl+S / Cmd+S)
2. Check if file watchers are working
3. Restart development server

## Testing API Endpoints

Use these curl commands to test if your backend is working:

```bash
# Test server health
curl http://localhost:5000/api

# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Test getting products
curl http://localhost:5000/api/products
```

## Debugging Steps

### Systematic Debugging:
1. **Check if both servers are running**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

2. **Verify environment files**
   - Backend: `omegally-backend/.env`
   - Frontend: `omegally/.env`

3. **Check browser console**
   - Open F12 Developer Tools
   - Look for errors in Console tab
   - Check Network tab for failed requests

4. **Check backend terminal**
   - Look for error messages
   - Verify database connection
   - Check for syntax errors

5. **Test API directly**
   - Use Postman or curl
   - Test individual endpoints
   - Verify responses

## Getting Help

If none of these solutions work:

1. **Check the full error message** - Copy the complete error
2. **Note your environment** - OS, Node version, npm version
3. **List what you tried** - What troubleshooting steps you already attempted
4. **Check the GitHub Issues** - Look for similar problems
5. **Create a detailed issue** - Include error messages and environment details

## Environment Checklist

Before asking for help, verify:
- [ ] Node.js installed and version >= 16
- [ ] MongoDB installed and running (or Atlas connection working)
- [ ] Both `.env` files created and configured
- [ ] Dependencies installed in both directories
- [ ] No port conflicts
- [ ] Firewall not blocking ports 3000 or 5000

---

**Remember:** Most issues are configuration-related. Double-check your environment files and make sure both servers are running!
**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
```bash
# Windows (MongoDB as Service):
net start MongoDB

# macOS (Homebrew):
brew services start mongodb-community

# Linux (systemd):
sudo systemctl start mongod
```

### 3. Authentication Failed (MongoDB Atlas)
**Error:** `Authentication failed`

**Solution:**
- Check username/password in connection string
- Ensure IP address is whitelisted in Atlas
- Verify database user has proper permissions

## 🌐 Frontend Issues

### 1. API Connection Failed
**Error:** `Network Error` or `CORS error`

**Solutions:**
1. Ensure backend is running on port 5000
2. Check frontend `.env`: `REACT_APP_API_URL=http://localhost:5000/api`
3. Verify backend CORS configuration allows `http://localhost:3000`

### 2. React App Won't Start
**Error:** Various React/webpack errors

**Solutions:**
```bash
# Clear npm cache and node_modules
cd omegally
rm -rf node_modules
npm cache clean --force
npm install
```

### 3. Browser Console Errors
**Error:** `Failed to fetch` or similar API errors

**Solutions:**
1. Open browser dev tools (F12)
2. Check Network tab for failed requests
3. Verify backend API endpoints are responding
4. Check if both servers are running

## 🔐 Authentication Issues

### 1. JWT Errors
**Error:** `JsonWebTokenError: invalid token`

**Solutions:**
1. Check JWT secrets match between frontend and backend
2. Clear browser localStorage/cookies
3. Verify token hasn't expired

### 2. Login/Registration Not Working
**Solutions:**
1. Check browser console for errors
2. Verify backend user routes are working
3. Test API endpoints with Postman/curl

## 📦 Dependency Issues

### 1. Package Installation Fails
**Error:** Various npm install errors

**Solutions:**
```bash
# Update npm
npm install -g npm@latest

# Clear cache
npm cache clean --force

# Delete lockfile and try again
rm package-lock.json
npm install
```

### 2. Version Conflicts
**Error:** Peer dependency warnings

**Solutions:**
1. Check if warnings are actually errors
2. Update dependencies: `npm update`
3. Use `npm install --force` as last resort

## 🔧 Development Environment

### 1. Environment Variables Not Loading
**Error:** `undefined` values for environment variables

**Solutions:**
1. Ensure `.env` files exist in both directories
2. Check `.env` file format (no spaces around `=`)
3. Restart servers after changing `.env`

### 2. Hot Reload Not Working
**Issue:** Changes don't reflect automatically

**Solutions:**
1. Save files properly (Ctrl+S / Cmd+S)
2. Check if file watchers are working
3. Restart development server

## 🧪 Testing API Endpoints

Use these curl commands to test if your backend is working:

```bash
# Test server health
curl http://localhost:5000/api

# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Test getting products
curl http://localhost:5000/api/products
```

## 📊 Debugging Steps

### Systematic Debugging:
1. **Check if both servers are running**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

2. **Verify environment files**
   - Backend: `omegally-backend/.env`
   - Frontend: `omegally/.env`

3. **Check browser console**
   - Open F12 Developer Tools
   - Look for errors in Console tab
   - Check Network tab for failed requests

4. **Check backend terminal**
   - Look for error messages
   - Verify database connection
   - Check for syntax errors

5. **Test API directly**
   - Use Postman or curl
   - Test individual endpoints
   - Verify responses

## 🆘 Getting Help

If none of these solutions work:

1. **Check the full error message** - Copy the complete error
2. **Note your environment** - OS, Node version, npm version
3. **List what you tried** - What troubleshooting steps you already attempted
4. **Check the GitHub Issues** - Look for similar problems
5. **Create a detailed issue** - Include error messages and environment details

## 📋 Environment Checklist

Before asking for help, verify:
- [ ] Node.js installed and version >= 16
- [ ] MongoDB installed and running (or Atlas connection working)
- [ ] Both `.env` files created and configured
- [ ] Dependencies installed in both directories
- [ ] No port conflicts
- [ ] Firewall not blocking ports 3000 or 5000

---

**Remember:** Most issues are configuration-related. Double-check your environment files and make sure both servers are running!