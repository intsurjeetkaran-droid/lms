# Laundry Service Management System

A full-stack laundry management platform connecting customers, service providers, and administrators. Customers find nearby providers, place orders with GPS-based pickup, and pay via UPI or cash. Providers manage their garment catalog, set their own custom item price ranges, and handle the full order workflow.

## 🌐 Live Demo

- **Frontend**: https://lms-frontend-98mc.onrender.com
- **Backend API**: https://lms-d0ql.onrender.com
- **Status**: ✅ Production Ready

## 🚀 Features

### 👤 Customer
- Multi-step registration with role selection
- Browse nearby providers based on GPS location
- Select garments with real-time pricing
- Add custom items — see the provider's allowed price range as a hint
- GPS-based pickup location selection
- Track order status in real-time
- UPI and Cash on Delivery payment options
- Submit feedback and ratings
- Raise complaints

### 🏪 Service Provider
- Multi-step registration with business details and GPS location
- Admin approval before going live
- Manage garment catalog with custom pricing
- **Set a custom item price range** (default ₹20–₹100, editable anytime)
- Garment prices are validated against the provider's own range — out-of-range entries are blocked
- Review orders and set prices for custom items
- Full order status workflow management
- Configure UPI, QR code, pickup/delivery/distance charges

### 👨‍💼 Administrator
- Monitor all users and orders
- Block/unblock users
- Approve service providers
- Handle customer complaints
- View system analytics and revenue

## 📋 Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS** — dark mode support
- **Axios**
- **React Router**
- **Leaflet** — interactive maps
- **Lucide React** — icons

### Backend
- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **JWT** authentication
- **bcrypt** password hashing

### Deployment
- **Render** — frontend (static) + backend (Node)
- **MongoDB Atlas** — cloud database

## 🏗️ Project Structure

```
laundry-service/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # MongoDB schemas
│   │   └── PriceRange.js  # Per-provider custom item price range
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper functions
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth context
│   │   ├── landing/     # Landing page
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   └── provider/
│   │   └── config/      # API configuration
│   └── dist/            # Production build
└── README.md
```

## 🔧 Local Development

### Prerequisites
- Node.js v16+
- MongoDB Atlas account or local MongoDB

### Backend

```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

```bash
npm run dev
```

Runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

Update `src/config/api.js` to point to `http://localhost:5000` for local development.

### Seed Test Data

```bash
cd backend
npm run seed
```

Creates 1 admin, 10 providers, 5 customers, 80 garments, 15 sample orders, feedback, and complaints. All passwords: `123456`. See `credentials.txt` for full list.

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |

### Garments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/garments/price-range/:providerId` | Public | Get a provider's custom item price range |
| GET | `/api/garments/my-price-range` | Provider | Get own price range |
| PUT | `/api/garments/my-price-range` | Provider | Update own price range |
| POST | `/api/garments` | Provider | Add garment (price validated against range) |
| GET | `/api/garments/provider/:id` | Public | Get provider's active garments |
| GET | `/api/garments/my-garments` | Provider | Get own garments |
| PUT | `/api/garments/:id` | Provider | Update garment |
| DELETE | `/api/garments/:id` | Provider | Delete garment |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my-orders` | Customer orders |
| GET | `/api/orders/provider-orders` | Provider orders |
| PUT | `/api/orders/:id/review` | Provider reviews order |
| PUT | `/api/orders/:id/status` | Update order status |

### Providers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/providers/profile` | Create profile |
| GET | `/api/providers/nearby` | Nearby providers |
| POST | `/api/providers/payment-config` | Setup payment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/block` | Block/unblock |
| PUT | `/api/admin/providers/:id/approve` | Approve provider |
| GET | `/api/admin/orders` | All orders |
| GET | `/api/admin/stats` | Dashboard stats |

## 🗺️ Order Status Flow

```
awaiting_review → confirmed → picked_up → processing → delivered → completed
```

## 💰 Custom Item Price Range

Each provider controls their own price range for custom items:

- **Default**: ₹20 – ₹100
- Provider can edit the range anytime from the Manage Garments page
- All garment prices (create and update) are validated server-side against the provider's range — requests outside the range return a `400` error
- Customers see the provider's specific range as a hint when adding custom items to an order

## 💳 Payment Flow

1. Customer creates order → `awaiting_review`
2. Provider reviews, sets final price → `confirmed`
3. Customer selects UPI or COD
4. For UPI: customer pays and enters transaction ID
5. For COD: payment collected on delivery
6. Order proceeds through pickup → processing → delivered → completed

## 🔐 Security

- bcrypt password hashing
- JWT authentication with role-based route protection
- Admin role cannot be created from the frontend
- Input validation on all endpoints
- Provider approval system
- Audit logging for critical actions
- Blocked users rejected at middleware level

## 🎨 Design

- Light and dark mode on all pages
- Mobile-first responsive design (320px+)
- Touch-optimized controls
- Accessible color contrast

## 📊 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | 123456 |
| Provider | provider1@test.com – provider10@test.com | 123456 |
| Customer | customer1@test.com – customer5@test.com | 123456 |

See `credentials.txt` for names and phone numbers.

## 📄 License

Open source — free for educational and commercial use.

---

**Built with ❤️ for efficient laundry management**
