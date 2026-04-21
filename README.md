# Laundry Service Management System

A comprehensive full-stack laundry management platform where customers can select garments individually, service providers control pricing dynamically, and the system handles pickup & delivery with GPS integration.

## 🌐 Live Demo

- **Frontend**: https://lms-frontend-98mc.onrender.com
- **Backend API**: https://lms-d0ql.onrender.com
- **Android App**: [Download APK](./APK_DOWNLOAD.md) (4.32 MB)
- **Status**: ✅ Production Ready

## 🚀 Features

### 👤 Customer Features
- Multi-step registration with role selection
- Browse nearby service providers based on GPS location
- Select garments individually with real-time pricing
- Add custom garments for provider review
- GPS-based location selection for pickup
- Track order status in real-time
- Multiple payment options (UPI & COD)
- Give feedback and ratings
- Raise complaints if needed

### 🏪 Service Provider Features
- Multi-step registration with business details
- Automatic location detection using browser GPS
- Complete profile setup with shop location
- Admin approval system before accepting orders
- Manage garment catalog with custom pricing
- Review and approve orders with custom item pricing
- Update order status through workflow
- Configure payment methods (UPI ID, QR Code)
- Set pickup, delivery, and distance charges
- Navigate to customer locations via GPS

### 👨‍💼 Administrator Features
- Monitor all users and orders
- Block/unblock users
- Approve service providers
- Handle customer complaints
- View system analytics and revenue

## 📋 Tech Stack

### Frontend
- **React** (Vite) - Fast and modern UI framework
- **Tailwind CSS** - Utility-first styling with dark mode
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Leaflet** - Interactive maps for location selection
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Professional icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Deployment
- **Render** - Both frontend and backend hosting
- **MongoDB Atlas** - Cloud database
- **Git** - Version control

## 🏗️ Project Structure

```
laundry-service/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context (Auth)
│   │   ├── landing/     # Landing page components
│   │   ├── pages/       # Route pages (admin, customer, provider)
│   │   ├── config/      # API configuration
│   │   └── utils/       # Helper utilities
│   └── dist/            # Production build
├── render.yaml          # Render deployment config
└── README.md            # This file
```

## 🔧 Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `src/config/api.js`:
```javascript
const PRODUCTION_BACKEND = 'http://localhost:5000';
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Database Seeding (Optional)

Seed the database with test data:

```bash
cd backend
npm run seed
```

This creates:
- 1 Admin account
- 10 Provider accounts (with profiles, garments, payment configs)
- 5 Customer accounts
- 80 Garments (8 types per provider)
- 15 Sample orders
- Feedback and complaints

Check `credentials.txt` for login details. All passwords are `123456`.

## 🌐 Deployment

### Render Deployment (Current Setup)

The project is configured for Render deployment with `render.yaml`:

**Backend Service:**
- Name: `lms`
- Type: Node.js web service
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables: Set in Render dashboard

**Frontend Service:**
- Name: `lms-frontend`
- Type: Static site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

### Environment Variables (Render Dashboard)

Set these in your Render backend service:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Random secret key for JWT
- `JWT_EXPIRE` - Token expiration (e.g., `7d`)
- `NODE_ENV` - Set to `production`

### Deployment Steps

1. **Push to GitHub:**
```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

2. **Render Auto-Deploys:**
- Backend redeploys automatically on push
- Frontend rebuilds automatically on push
- Check deploy logs in Render dashboard

3. **Update Frontend API URL:**
- Edit `frontend/src/config/api.js`
- Set `PRODUCTION_BACKEND` to your Render backend URL
- Commit and push changes

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get customer orders
- `GET /api/orders/provider-orders` - Get provider orders
- `PUT /api/orders/:id/review` - Review order (provider)
- `PUT /api/orders/:id/status` - Update order status

### Garments
- `POST /api/garments` - Add garment
- `GET /api/garments/provider/:id` - Get provider garments
- `PUT /api/garments/:id` - Update garment
- `DELETE /api/garments/:id` - Delete garment

### Providers
- `POST /api/providers/profile` - Create provider profile
- `GET /api/providers/nearby` - Get nearby providers
- `POST /api/providers/payment-config` - Setup payment config

### Feedback & Complaints
- `POST /api/feedback` - Submit feedback
- `POST /api/complaints` - Raise complaint
- `PUT /api/complaints/:id` - Update complaint (admin)

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/block` - Block/unblock user
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/stats` - Get dashboard statistics

## 🗺️ Order Status Flow

```
awaiting_review → confirmed → picked_up → processing → delivered → completed
```

## 💳 Payment Flow

1. Customer creates order (status: `awaiting_review`)
2. Provider reviews and sets final price (status: `confirmed`)
3. Customer sees final price and payment options
4. Customer selects payment method (UPI/COD)
5. For UPI: Customer pays and enters transaction ID
6. For COD: Payment collected on delivery
7. Order proceeds through workflow

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with role-based access
- Admin role protection (cannot create admin from frontend)
- Role validation (only customer and provider allowed in registration)
- Input validation on all forms
- Secure API endpoints
- Audit logging for critical actions
- Provider approval system

## 🎨 Design System

### Color Palette

**Light Theme:**
- Background: Sky 50 (#f0f9ff)
- Primary: Sky 500 (#0ea5e9)
- Cards: White (#ffffff)

**Dark Theme:**
- Background: Slate 900 (#0f172a)
- Primary: Sky 400 (#38bdf8)
- Cards: Slate 800 (#1e293b)

### Features
- Complete light/dark mode support on all pages
- Smooth theme transitions
- Mobile-first responsive design (320px+)
- Touch-optimized buttons and controls
- Accessible color contrast ratios
- Professional animations with Framer Motion

## 📱 Mobile App (Android)

The system includes a native Android mobile application using Capacitor.

### Mobile Features
- Native GPS location detection
- Secure token storage
- Professional splash screen
- Android back button support
- Same UI as web version
- Full dark mode support
- Offline support with cached data

### APK Location
```
LaundryApp.apk (in project root) - 4.3 MB
```

### Installation
1. Copy `LaundryApp.apk` to your Android phone
2. Open the APK file
3. Allow "Install from Unknown Sources" if prompted
4. Tap "Install"
5. Open the app

### Requirements
- Android 5.1 (Lollipop) or higher
- Internet connection
- Location permission

## 📊 Test Accounts

If you ran the database seeder, use these credentials:

**Admin:**
- Email: admin@test.com
- Password: 123456

**Providers:**
- Email: provider1@test.com to provider10@test.com
- Password: 123456

**Customers:**
- Email: customer1@test.com to customer5@test.com
- Password: 123456

Check `credentials.txt` for complete list with names and phone numbers.

## 🤝 Contributing

This is a complete project template. Feel free to customize and extend based on your requirements.

## 📄 License

This project is open source and available for educational and commercial use.

## 📞 Support

For issues or questions, please refer to the `DETAILS.txt` file for non-technical documentation.

---

**Built with ❤️ for efficient laundry management**

**Live on Render** | **Production Ready** | **Fully Functional**
