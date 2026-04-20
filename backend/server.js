import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import garmentRoutes from './routes/garmentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Connect to MongoDB database
console.log('🔌 Initializing database connection...');
connectDB();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Enable CORS (Cross-Origin Resource Sharing) for frontend communication
console.log('🔧 Configuring middleware...');
app.use(cors({
  origin: '*', // Allow all origins (mobile + web)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Enhanced request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const origin = req.headers.origin || 'No Origin';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const isMobile = userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone');
  
  console.log('='.repeat(60));
  console.log(`📥 ${req.method} ${req.path}`);
  console.log(`⏰ Time: ${timestamp}`);
  console.log(`🌐 Origin: ${origin}`);
  console.log(`📱 Device: ${isMobile ? 'Mobile' : 'Desktop'}`);
  console.log(`🔧 User-Agent: ${userAgent.substring(0, 80)}...`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
  }
  
  console.log('='.repeat(60));
  
  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`📤 Response Status: ${res.statusCode}`);
    if (res.statusCode >= 400) {
      console.log(`❌ Error Response:`, data);
    } else {
      console.log(`✅ Success Response`);
    }
    console.log('='.repeat(60));
    originalSend.call(this, data);
  };
  
  next();
});

// ============================================
// API ROUTES
// ============================================
console.log('🛣️  Setting up API routes...');

// Authentication routes (login, register, get current user)
app.use('/api/auth', authRoutes);

// User profile routes
app.use('/api/users', userRoutes);

// Provider-specific routes (profile, nearby providers)
app.use('/api/providers', providerRoutes);

// Garment management routes
app.use('/api/garments', garmentRoutes);

// Order management routes
app.use('/api/orders', orderRoutes);

// Payment configuration routes
app.use('/api/payments', paymentRoutes);

// Feedback and rating routes
app.use('/api/feedback', feedbackRoutes);

// Complaint management routes
app.use('/api/complaints', complaintRoutes);

// Admin panel routes
app.use('/api/admin', adminRoutes);

// ============================================
// UTILITY ENDPOINTS
// ============================================

// Health check endpoint - verify server is running
app.get('/api/health', (req, res) => {
  console.log('✅ Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to check database users (for debugging)
app.get('/api/test/users', async (req, res) => {
  try {
    console.log('🔍 Fetching all users from database...');
    const User = (await import('./models/User.js')).default;
    const users = await User.find({}).select('name email role');
    console.log(`✅ Found ${users.length} users in database`);
    res.json({ count: users.length, users });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// Global error handler middleware
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces (allows emulator access)

app.listen(PORT, HOST, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Local: http://localhost:${PORT}/api`);
  console.log(`📱 Emulator: http://10.0.2.2:${PORT}/api`);
  console.log(`🔗 Network: Server accessible from all network interfaces`);
  console.log('='.repeat(50));
});
