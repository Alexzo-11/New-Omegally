# Omegally E-commerce Platform

A modern, full-stack e-commerce platform built with React and Node.js.

## Features

- Product catalog with search and filtering
- Shopping cart with installment payments
- User authentication (register/login)
- Payment processing with PayPal integration
- Responsive design for all devices
- Secure JWT-based authentication
- Order management system

## Tech Stack

**Frontend:**
- React 19.2.4
- React Router for navigation
- Axios for API calls
- CSS Modules for styling

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- PayPal SDK for payments
- bcryptjs for password hashing

## Quick Setup

### For Junior Developers - Easy Setup

**Follow manual setup:**
- See [SETUP.md](./SETUP.md) for detailed instructions
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) if you run into issues

### Quick Manual Setup

```bash
# Clone the repository
git clone https://github.com/Alexzo-11/New-Omegally.git
cd New-Omegally

# Setup backend
cd omegally-backend
cp .env.example .env
npm install
npm start

# Setup frontend (in new terminal)
cd omegally
cp .env.example .env
npm install
npm start
```

## Project Structure

```
New-Omegally/
├── omegally/                # React Frontend (Port 3000)
├── omegally-backend/        # Node.js Backend (Port 5000)
├── SETUP.md                 # Detailed setup instructions
├── TROUBLESHOOTING.md       # Common issues and solutions
└── README.md                # This file
```

## URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

## Documentation

- **[Setup Guide](./SETUP.md)** - Complete installation and configuration guide
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Solutions to common issues
- **[API Documentation](./omegally-backend/README.md)** - Backend API endpoints
- **[Frontend Guide](./omegally/README.md)** - React app documentation

## Development Commands

```bash
# Install all dependencies
npm run setup

# Run backend only
npm run dev:backend

# Run frontend only  
npm run dev:frontend

# Build for production
npm run build:frontend
```

## Database Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally
# Update .env: MONGODB_URI=mongodb://localhost:27017/omegally
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and get connection string
3. Update `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/omegally`

## Environment Variables

Copy the example files and update with your values:

**Backend (omegally-backend/.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/omegally
JWT_SECRET=your-secret-key
PAYPAL_CLIENT_ID=your-paypal-id
```

**Frontend (omegally/.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | Kill process: `lsof -ti:5000 \| xargs kill` |
| MongoDB connection error | Check MongoDB is running or Atlas connection |
| CORS errors | Verify frontend URL in backend CORS config |
| Module not found | Run `npm install` in both directories |

**For detailed solutions, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and check for errors
5. Submit a pull request

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/products` | Get all products |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/:id` | Get order details |

## Links

- **Demo:** [Live Demo](https://your-demo-url.com) _(if available)_
- **Issues:** [Report bugs or request features](https://github.com/Alexzo-11/New-Omegally/issues)
- **Discussions:** [Ask questions](https://github.com/Alexzo-11/New-Omegally/discussions)

## License

This project is licensed under the ISC License.

---

**Need Help?** 
- Read the [Setup Guide](./SETUP.md)
- Check [Troubleshooting](./TROUBLESHOOTING.md)  
- Open an [Issue](https://github.com/Alexzo-11/New-Omegally/issues)