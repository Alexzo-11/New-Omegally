# Omegally E-commerce Platform

Full-stack e-commerce application with React frontend and Node.js backend.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Alexzo-11/New-Omegally.git
cd New-Omegally
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd omegally-backend
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
Create a `.env` file in the `omegally-backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/omegally
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PAYPAL_CLIENT_ID=your-paypal-client-id-here
```

#### Start the backend server
```bash
npm start
```
Backend should now be running on `http://localhost:5000`

### 3. Frontend Setup

#### Open a NEW terminal and navigate to frontend directory
```bash
cd omegally
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
Create a `.env` file in the `omegally` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start the frontend development server
```bash
npm start
```
# Omegally E-commerce Platform Setup Guide

Full-stack e-commerce application with React frontend and Node.js backend.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Alexzo-11/New-Omegally.git
cd New-Omegally
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd omegally-backend
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
Create a `.env` file in the `omegally-backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/omegally
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PAYPAL_CLIENT_ID=your-paypal-client-id-here
```

#### Start the backend server
```bash
npm start
```
Backend should now be running on `http://localhost:5000`

### 3. Frontend Setup

#### Open a NEW terminal and navigate to frontend directory
```bash
cd omegally
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
Create a `.env` file in the `omegally` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start the frontend development server
```bash
npm start
```
Frontend should now be running on `http://localhost:3000`

## Project Structure

```
New-Omegally/
├── omegally/                    # React Frontend
│   ├── src/
│   │   ├── api/                 # API client
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── context/             # React context
│   │   └── data/                # Static data
│   ├── public/
│   ├── package.json
│   └── .env                     # Frontend environment variables
└── omegally-backend/            # Node.js Backend
    ├── src/
    │   ├── controllers/         # Route controllers
    │   ├── models/              # MongoDB models
    │   ├── routes/              # API routes
    │   ├── middleware/          # Express middleware
    │   ├── config/              # Configuration files
    │   └── utils/               # Utility functions
    ├── package.json
    └── .env                     # Backend environment variables
```

## Environment Variables

### Backend (.env in omegally-backend/)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/omegally` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `your-refresh-secret` |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `PAYPAL_CLIENT_ID` | PayPal integration | `your-paypal-id` |

### Frontend (.env in omegally/)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Common Issues & Solutions

### Issue: "Cannot find module '../models/User'"
**Solution:** The model files use `Users.js` (plural). This is already fixed in the codebase.

### Issue: "Missing script: start"
**Solution:** Make sure you're in the correct directory:
- Backend: `cd omegally-backend`
- Frontend: `cd omegally`

### Issue: MongoDB Connection Error
**Solutions:**
1. Install MongoDB locally: [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)
2. Or use MongoDB Atlas (cloud): Update `MONGODB_URI` in `.env`
3. Make sure MongoDB service is running

### Issue: Port already in use
**Solutions:**
- Kill the process: `lsof -ti:5000 | xargs kill` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
- Change the port in backend `.env` file

## Development Workflow

### Running both servers simultaneously
1. **Terminal 1:** Start backend
   ```bash
   cd omegally-backend
   npm start
   ```

2. **Terminal 2:** Start frontend
   ```bash
   cd omegally
   npm start
   ```

### API Endpoints
The backend provides these main endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/products` - Get products
- `POST /api/orders` - Create order
- `POST /api/payments` - Process payment

### Testing the Connection
1. Backend running: Visit `http://localhost:5000/api` 
2. Frontend running: Visit `http://localhost:3000`
3. Check browser console for API call errors

## Production Deployment

### Backend
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production MongoDB URI
- Set up proper CORS origins

### Frontend  
- Run `npm run build`
- Serve the `build` folder
- Update `REACT_APP_API_URL` to production backend URL

## Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

**Need Help?** 
- Check the browser console for frontend errors
- Check the terminal for backend errors
- Ensure both servers are running on different ports (3000 & 5000)