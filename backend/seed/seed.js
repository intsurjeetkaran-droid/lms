import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import dotenv from 'dotenv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Garment from '../models/Garment.js';
import PaymentConfig from '../models/PaymentConfig.js';
import Order from '../models/Order.js';
import Feedback from '../models/Feedback.js';
import Complaint from '../models/Complaint.js';

// Configuration
const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry-service';

console.log('📝 Using MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password in logs

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper function to log with colors
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Check if backend is running
const checkBackend = () => {
  return new Promise((resolve, reject) => {
    log('🔍 Checking backend...', 'cyan');
    
    const req = http.get(BACKEND_URL, (res) => {
      if (res.statusCode === 200 || res.statusCode === 404) {
        log('✅ Backend is running', 'green');
        resolve(true);
      } else {
        reject(new Error('Backend returned unexpected status'));
      }
    });

    req.on('error', (err) => {
      log('❌ Backend not running. Start backend first with: npm run dev', 'red');
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Backend connection timeout'));
    });
  });
};

// Check if frontend is running
const checkFrontend = () => {
  return new Promise((resolve) => {
    log('🔍 Checking frontend...', 'cyan');
    
    const req = http.get(FRONTEND_URL, (res) => {
      if (res.statusCode === 200) {
        log('✅ Frontend is running', 'green');
        resolve(true);
      } else {
        log('⚠️  Frontend not running (optional but recommended)', 'yellow');
        resolve(false);
      }
    });

    req.on('error', () => {
      log('⚠️  Frontend not running (optional but recommended)', 'yellow');
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      log('⚠️  Frontend not running (optional but recommended)', 'yellow');
      resolve(false);
    });
  });
};

// Connect to database
const connectDB = async () => {
  try {
    log('🔌 Connecting to MongoDB...', 'cyan');
    await mongoose.connect(MONGODB_URI);
    log('✅ MongoDB connected', 'green');
  } catch (error) {
    log(`❌ MongoDB connection failed: ${error.message}`, 'red');
    throw error;
  }
};

// Clear existing data
const clearDatabase = async () => {
  try {
    log('🗑️  Clearing existing data...', 'yellow');
    
    await User.deleteMany({});
    await ProviderProfile.deleteMany({});
    await Garment.deleteMany({});
    await PaymentConfig.deleteMany({});
    await Order.deleteMany({});
    await Feedback.deleteMany({});
    await Complaint.deleteMany({});
    
    log('✅ Database cleared', 'green');
  } catch (error) {
    log(`❌ Error clearing database: ${error.message}`, 'red');
    throw error;
  }
};

// Create users
const createUsers = async () => {
  try {
    log('👥 Creating users...', 'cyan');
    
    // Don't hash password here - let the User model's pre-save hook handle it
    const users = [];

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      phone: '9999999999',
      password: '123456', // Plain text - will be hashed by pre-save hook
      role: 'admin',
    });
    users.push({ type: 'admin', user: admin });
    log('  ✓ Admin created', 'green');

    // Create providers
    const providerNames = [
      'CleanWash Services',
      'FreshFold Laundry',
      'QuickLaundry Express',
      'SparkleClean',
      'PureWash Solutions',
      'RapidDry Laundry',
      'CrystalClean',
      'EcoWash Green',
      'PremiumPress',
      'SwiftWash Pro'
    ];

    for (let i = 0; i < 10; i++) {
      const provider = await User.create({
        name: providerNames[i],
        email: `provider${i + 1}@test.com`,
        phone: `98765432${10 + i}`,
        password: '123456', // Plain text - will be hashed by pre-save hook
        role: 'provider',
      });
      users.push({ type: 'provider', user: provider });
    }
    log(`  ✓ ${providerNames.length} Providers created`, 'green');

    // Create customers
    const customerNames = [
      'Rajesh Kumar',
      'Priya Sharma',
      'Amit Patel',
      'Sneha Reddy',
      'Vikram Singh'
    ];

    for (let i = 0; i < 5; i++) {
      const customer = await User.create({
        name: customerNames[i],
        email: `customer${i + 1}@test.com`,
        phone: `87654321${10 + i}`,
        password: '123456', // Plain text - will be hashed by pre-save hook
        role: 'customer',
      });
      users.push({ type: 'customer', user: customer });
    }
    log(`  ✓ ${customerNames.length} Customers created`, 'green');

    return users;
  } catch (error) {
    log(`❌ Error creating users: ${error.message}`, 'red');
    throw error;
  }
};

// Create provider profiles
const createProviders = async (users) => {
  try {
    log('🏪 Creating provider profiles...', 'cyan');
    
    const providers = users.filter(u => u.type === 'provider');
    
    // Locations around Gwalior, Madhya Pradesh (focusing on Thatipur and nearby areas)
    const locations = [
      { city: 'Gwalior - Thatipur', lat: 26.2183, lng: 78.1828, address: 'Thatipur, Gwalior, Madhya Pradesh' },
      { city: 'Gwalior - City Center', lat: 26.2124, lng: 78.1772, address: 'City Center, Gwalior, Madhya Pradesh' },
      { city: 'Gwalior - Lashkar', lat: 26.2295, lng: 78.1686, address: 'Lashkar, Gwalior, Madhya Pradesh' },
      { city: 'Gwalior - Morar', lat: 26.2346, lng: 78.2285, address: 'Morar, Gwalior, Madhya Pradesh' },
      { city: 'Gwalior - Maharaj Bada', lat: 26.2183, lng: 78.1698, address: 'Maharaj Bada, Gwalior, Madhya Pradesh' },
      { city: 'Gwalior - Hazira', lat: 26.2089, lng: 78.1642, address: 'Hazira, Gwalior, Madhya Pradesh' },
      { city: 'Gwalior - Kampoo', lat: 26.2456, lng: 78.1923, address: 'Kampoo, Gwalior, Madhya Pradesh' },
      { city: 'Gwalior - Bahodapur', lat: 26.1987, lng: 78.1534, address: 'Bahodapur, Gwalior, Madhya Pradesh' },
      { city: 'Gwalior - Jiwaji Ganj', lat: 26.2267, lng: 78.1845, address: 'Jiwaji Ganj, Gwalior, Madhya Pradesh' },
      { city: 'Gwalior - Padav', lat: 26.2412, lng: 78.1756, address: 'Padav, Gwalior, Madhya Pradesh' }
    ];

    const createdProviders = [];

    for (let i = 0; i < providers.length; i++) {
      const location = locations[i];
      const serviceRadius = 5 + Math.floor(Math.random() * 10); // 5-15 km

      // Create provider profile
      const profile = await ProviderProfile.create({
        userId: providers[i].user._id,
        shopName: providers[i].user.name,
        address: location.address,
        location: {
          lat: location.lat,
          lng: location.lng
        },
        serviceRadius,
        isApproved: true, // All providers pre-approved
        isAvailable: true
      });

      // Create payment config
      await PaymentConfig.create({
        providerId: providers[i].user._id,
        upiId: `${providers[i].user.name.toLowerCase().replace(/\s+/g, '')}@upi`,
        qrCode: `https://example.com/qr/${providers[i].user._id}.png`,
        codEnabled: true,
        pickupCharge: 20 + Math.floor(Math.random() * 30), // 20-50
        deliveryCharge: 20 + Math.floor(Math.random() * 30), // 20-50
        distanceRate: 5 + Math.floor(Math.random() * 5) // 5-10 per km
      });

      createdProviders.push({
        userId: providers[i].user._id,
        profile
      });
    }

    log(`  ✓ ${createdProviders.length} Provider profiles created in Gwalior area`, 'green');
    return createdProviders;
  } catch (error) {
    log(`❌ Error creating providers: ${error.message}`, 'red');
    throw error;
  }
};

// Create garments
const createGarments = async (providers) => {
  try {
    log('👕 Creating garments...', 'cyan');
    
    const garmentTypes = [
      { name: 'Shirt', minPrice: 10, maxPrice: 20 },
      { name: 'T-Shirt', minPrice: 8, maxPrice: 15 },
      { name: 'Jeans', minPrice: 20, maxPrice: 35 },
      { name: 'Saree', minPrice: 30, maxPrice: 60 },
      { name: 'Bedsheet', minPrice: 25, maxPrice: 50 }
    ];

    let totalGarments = 0;

    for (const provider of providers) {
      for (const garment of garmentTypes) {
        const price = garment.minPrice + Math.floor(Math.random() * (garment.maxPrice - garment.minPrice + 1));
        await Garment.create({
          providerId: provider.userId,
          name: garment.name,
          price: price,
          isActive: true
        });
        totalGarments++;
      }
    }

    log(`  ✓ ${totalGarments} Garments created (5 types per provider)`, 'green');
  } catch (error) {
    log(`❌ Error creating garments: ${error.message}`, 'red');
    throw error;
  }
};

// Create orders
const createOrders = async (users, providers) => {
  try {
    log('📦 Creating orders...', 'cyan');
    
    const customers = users.filter(u => u.type === 'customer');
    const statuses = ['awaiting_review', 'confirmed', 'picked_up', 'processing', 'delivered', 'completed'];
    const paymentStatuses = ['pending', 'paid'];
    const paymentMethods = ['upi', 'cod'];
    
    const createdOrders = [];

    // Create 20 orders with proper status distribution
    const statusDistribution = [
      'awaiting_review', 'awaiting_review', 'awaiting_review', // 3 new orders
      'confirmed', 'confirmed', // 2 confirmed
      'picked_up', 'picked_up', // 2 picked up
      'processing', 'processing', 'processing', // 3 processing
      'delivered', 'delivered', 'delivered', 'delivered', // 4 delivered
      'completed', 'completed', 'completed', 'completed', 'completed', 'completed' // 6 completed
    ];

    for (let i = 0; i < 20; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const provider = providers[Math.floor(Math.random() * providers.length)];
      
      // Get garments for this provider
      const garments = await Garment.find({ providerId: provider.userId });
      
      // Create order items
      const items = [];
      let itemsTotal = 0;
      
      // Add 2-4 regular items
      const numItems = 2 + Math.floor(Math.random() * 3);
      const selectedGarments = [];
      for (let j = 0; j < numItems && j < garments.length; j++) {
        const randomIndex = Math.floor(Math.random() * garments.length);
        const garment = garments[randomIndex];
        
        // Avoid duplicates
        if (!selectedGarments.includes(garment.name)) {
          selectedGarments.push(garment.name);
          const quantity = 1 + Math.floor(Math.random() * 3); // 1-3 items
          const finalPrice = garment.price * quantity;
          
          items.push({
            name: garment.name,
            quantity,
            basePrice: garment.price,
            finalPrice,
            isCustom: false
          });
          
          itemsTotal += finalPrice;
        }
      }
      
      // 40% chance to add a custom item
      if (Math.random() > 0.6) {
        const customItems = ['Curtain', 'Carpet', 'Blanket', 'Pillow Cover', 'Table Cloth'];
        const customName = customItems[Math.floor(Math.random() * customItems.length)];
        const customPrice = 30 + Math.floor(Math.random() * 70); // 30-100
        items.push({
          name: customName,
          quantity: 1,
          basePrice: customPrice,
          finalPrice: customPrice,
          isCustom: true
        });
        itemsTotal += customPrice;
      }
      
      // Calculate charges
      const distance = 1 + Math.random() * 9; // 1-10 km
      const pickupCharge = 20;
      const deliveryCharge = 20;
      const distanceCharge = Math.round(distance * 5); // ₹5 per km
      const extraCharge = Math.random() > 0.8 ? Math.floor(Math.random() * 30) : 0;
      
      const totalPrice = Math.round(itemsTotal + pickupCharge + deliveryCharge + distanceCharge + extraCharge);
      
      // Use distributed status
      const status = statusDistribution[i];
      
      // Payment status logic
      let paymentStatus = 'pending';
      if (status === 'picked_up' || status === 'processing' || status === 'delivered' || status === 'completed') {
        paymentStatus = 'paid';
      } else if (status === 'confirmed') {
        paymentStatus = Math.random() > 0.5 ? 'paid' : 'pending';
      }
      
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Create order
      const order = await Order.create({
        customerId: customer.user._id,
        providerId: provider.userId,
        items,
        pickupLocation: {
          address: provider.profile.address,
          lat: provider.profile.location.lat + (Math.random() - 0.5) * 0.05,
          lng: provider.profile.location.lng + (Math.random() - 0.5) * 0.05
        },
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal
        charges: {
          pickup: pickupCharge,
          delivery: deliveryCharge,
          distance: distanceCharge,
          extra: extraCharge
        },
        totalPrice,
        status,
        paymentMethod,
        paymentStatus,
        transactionId: paymentStatus === 'paid' && paymentMethod === 'upi' ? `TXN${Date.now()}${i}` : undefined
      });
      
      createdOrders.push(order);
    }

    log(`  ✓ ${createdOrders.length} Orders created with status distribution`, 'green');
    log(`    - ${statusDistribution.filter(s => s === 'awaiting_review').length} awaiting review`, 'blue');
    log(`    - ${statusDistribution.filter(s => s === 'confirmed').length} confirmed`, 'blue');
    log(`    - ${statusDistribution.filter(s => s === 'picked_up').length} picked up`, 'blue');
    log(`    - ${statusDistribution.filter(s => s === 'processing').length} processing`, 'blue');
    log(`    - ${statusDistribution.filter(s => s === 'delivered').length} delivered`, 'blue');
    log(`    - ${statusDistribution.filter(s => s === 'completed').length} completed`, 'blue');
    
    return createdOrders;
  } catch (error) {
    log(`❌ Error creating orders: ${error.message}`, 'red');
    throw error;
  }
};

// Create feedback
const createFeedback = async (orders) => {
  try {
    log('⭐ Creating feedback...', 'cyan');
    
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered');
    const reviews = [
      'Excellent service! Very satisfied.',
      'Good quality work, will use again.',
      'Fast and efficient service.',
      'Clothes were perfectly cleaned.',
      'Professional and timely delivery.',
      'Great experience overall.',
      'Highly recommended service.',
      'Very happy with the results.'
    ];
    
    let feedbackCount = 0;

    for (const order of completedOrders) {
      if (Math.random() > 0.3) { // 70% chance of feedback
        const rating = 3 + Math.floor(Math.random() * 3); // 3-5 stars
        await Feedback.create({
          orderId: order._id,
          customerId: order.customerId,
          providerId: order.providerId,
          rating,
          review: reviews[Math.floor(Math.random() * reviews.length)]
        });
        feedbackCount++;
      }
    }

    log(`  ✓ ${feedbackCount} Feedback entries created`, 'green');
  } catch (error) {
    log(`❌ Error creating feedback: ${error.message}`, 'red');
    throw error;
  }
};

// Create complaints
const createComplaints = async (orders) => {
  try {
    log('📢 Creating complaints...', 'cyan');
    
    const eligibleOrders = orders.filter(o => 
      o.status === 'completed' || o.status === 'delivered' || o.status === 'processing'
    );
    
    const complaintTypes = ['quality', 'delivery', 'payment', 'behavior', 'other'];
    const complaintData = {
      quality: {
        descriptions: [
          'The clothes were not cleaned properly. Found stains still present on my shirt.',
          'Items returned with bad smell. Not satisfied with the washing quality.',
          'My saree has color fading after wash. Very disappointed.',
          'Clothes were not ironed properly. Many wrinkles still visible.'
        ]
      },
      delivery: {
        descriptions: [
          'Delivery was delayed by 2 days. Very inconvenient for me.',
          'Promised delivery time was not met. Had to follow up multiple times.',
          'Delivery person did not come at scheduled time.',
          'Order was delivered to wrong address initially.'
        ]
      },
      payment: {
        descriptions: [
          'Was charged extra amount not mentioned in the order.',
          'Payment was deducted twice from my account.',
          'Final bill was higher than the confirmed amount.',
          'Hidden charges were added without prior information.'
        ]
      },
      behavior: {
        descriptions: [
          'Delivery person was rude and unprofessional.',
          'Staff did not respond to my queries properly.',
          'Very poor customer service experience.',
          'Pickup person was not courteous.'
        ]
      },
      other: {
        descriptions: [
          'Items were not properly packed and some were missing.',
          'General dissatisfaction with the service.',
          'Multiple issues with the order.',
          'Service did not meet expectations.'
        ]
      }
    };
    
    const statuses = ['pending', 'in_progress', 'resolved'];
    
    let complaintCount = 0;

    // Create 5-6 complaints
    const numComplaints = 5 + Math.floor(Math.random() * 2);
    const selectedOrders = [];
    
    for (let i = 0; i < numComplaints && i < eligibleOrders.length; i++) {
      // Select a random order that hasn't been used yet
      let order;
      do {
        order = eligibleOrders[Math.floor(Math.random() * eligibleOrders.length)];
      } while (selectedOrders.includes(order._id.toString()));
      
      selectedOrders.push(order._id.toString());
      
      const type = complaintTypes[Math.floor(Math.random() * complaintTypes.length)];
      const descriptions = complaintData[type].descriptions;
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      await Complaint.create({
        orderId: order._id,
        customerId: order.customerId,
        providerId: order.providerId,
        type,
        description,
        status,
        adminResponse: status === 'resolved' ? 'We have investigated this matter and taken appropriate action. The issue has been resolved.' : undefined,
        resolvedAt: status === 'resolved' ? new Date() : undefined
      });
      complaintCount++;
    }

    log(`  ✓ ${complaintCount} Complaints created`, 'green');
    const openCount = await Complaint.countDocuments({ status: { $in: ['pending', 'in_progress'] } });
    const resolvedCount = await Complaint.countDocuments({ status: 'resolved' });
    log(`    - ${openCount} open/in-progress`, 'blue');
    log(`    - ${resolvedCount} resolved`, 'blue');
  } catch (error) {
    log(`❌ Error creating complaints: ${error.message}`, 'red');
    throw error;
  }
};

// Generate credentials file
const generateCredentialsFile = async (users) => {
  try {
    log('📄 Generating credentials file...', 'cyan');
    
    let content = '='.repeat(60) + '\n';
    content += 'LAUNDRY SERVICE PLATFORM - LOGIN CREDENTIALS\n';
    content += '='.repeat(60) + '\n\n';
    content += 'All passwords: 123456\n\n';
    
    // Admin
    content += '='.repeat(60) + '\n';
    content += 'ADMIN ACCOUNT\n';
    content += '='.repeat(60) + '\n';
    const admin = users.find(u => u.type === 'admin');
    content += `Email: ${admin.user.email}\n`;
    content += `Password: 123456\n`;
    content += `Name: ${admin.user.name}\n\n`;
    
    // Providers
    content += '='.repeat(60) + '\n';
    content += 'PROVIDER ACCOUNTS (10)\n';
    content += '='.repeat(60) + '\n';
    const providers = users.filter(u => u.type === 'provider');
    providers.forEach((provider, index) => {
      content += `${index + 1}. ${provider.user.name}\n`;
      content += `   Email: ${provider.user.email}\n`;
      content += `   Password: 123456\n`;
      content += `   Phone: ${provider.user.phone}\n\n`;
    });
    
    // Customers
    content += '='.repeat(60) + '\n';
    content += 'CUSTOMER ACCOUNTS (5)\n';
    content += '='.repeat(60) + '\n';
    const customers = users.filter(u => u.type === 'customer');
    customers.forEach((customer, index) => {
      content += `${index + 1}. ${customer.user.name}\n`;
      content += `   Email: ${customer.user.email}\n`;
      content += `   Password: 123456\n`;
      content += `   Phone: ${customer.user.phone}\n\n`;
    });
    
    content += '='.repeat(60) + '\n';
    content += 'QUICK ACCESS\n';
    content += '='.repeat(60) + '\n';
    content += 'Admin: admin@test.com / 123456\n';
    content += 'Provider: provider1@test.com / 123456\n';
    content += 'Customer: customer1@test.com / 123456\n\n';
    
    content += '='.repeat(60) + '\n';
    content += 'NOTES\n';
    content += '='.repeat(60) + '\n';
    content += '- All accounts are pre-approved and active\n';
    content += '- All providers have isApproved: true\n';
    content += '- Providers have 5 garment types each (Shirt, T-Shirt, Jeans, Saree, Bedsheet)\n';
    content += '- 20 orders created with proper status distribution\n';
    content += '- Orders include both regular and custom items\n';
    content += '- Payment methods: UPI and Cash on Delivery\n';
    content += '- Feedback added for completed orders\n';
    content += '- 5-6 complaints created (open & resolved)\n';
    content += '- All dashboards will show realistic data\n';
    content += '- You can login with any account to test the system\n\n';
    
    // Write to root directory
    const credentialsPath = path.join(__dirname, '../../credentials.txt');
    fs.writeFileSync(credentialsPath, content);
    
    log(`  ✓ Credentials file created at: ${credentialsPath}`, 'green');
  } catch (error) {
    log(`❌ Error generating credentials file: ${error.message}`, 'red');
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('\n' + '='.repeat(60));
    log('🌱 LAUNDRY SERVICE PLATFORM - DATABASE SEEDER', 'blue');
    console.log('='.repeat(60) + '\n');

    // Step 1: Check backend
    await checkBackend();

    // Step 2: Check frontend
    await checkFrontend();

    // Step 3: System ready
    log('\n✅ System check complete. Starting database seeding...', 'green');
    console.log('='.repeat(60) + '\n');

    // Step 4: Connect to database
    await connectDB();

    // Step 5: Clear existing data
    await clearDatabase();

    console.log('');

    // Step 6: Create data
    const users = await createUsers();
    const providers = await createProviders(users);
    await createGarments(providers);
    const orders = await createOrders(users, providers);
    await createFeedback(orders);
    await createComplaints(orders);

    console.log('');

    // Generate credentials file
    await generateCredentialsFile(users);

    // Success message
    console.log('\n' + '='.repeat(60));
    log('🎉 SEEDING COMPLETED SUCCESSFULLY!', 'green');
    console.log('='.repeat(60));
    
    log('\n📊 Summary:', 'cyan');
    log(`  • 1 Admin account`, 'blue');
    log(`  • 10 Provider accounts (all approved)`, 'blue');
    log(`  • 5 Customer accounts`, 'blue');
    log(`  • ${providers.length * 5} Garments (5 types per provider)`, 'blue');
    log(`  • 20 Orders (distributed across all statuses)`, 'blue');
    log(`  • Feedback entries (for completed orders)`, 'blue');
    log(`  • 5-6 Complaint entries (open & resolved)`, 'blue');
    
    log('\n📁 Credentials file: credentials.txt (root folder)', 'yellow');
    log('🌐 You can now login and test the system!', 'green');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    log(`\n❌ Seeding failed: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
