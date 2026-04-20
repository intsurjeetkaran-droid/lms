import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';
import PaymentConfig from '../models/PaymentConfig.js';
import generateToken from '../utils/generateToken.js';

// ============================================
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// ============================================
export const register = async (req, res) => {
  try {
    console.log('📝 Registration attempt started');
    const { name, email, phone, password, role, shopName, address, location, serviceRadius } = req.body;
    
    console.log(`   📧 Email: ${email}`);
    console.log(`   👤 Name: ${name}`);
    console.log(`   🎭 Role: ${role || 'customer (default)'}`);

    // ============================================
    // SECURITY CHECK: Prevent admin role creation from frontend
    // ============================================
    if (role === 'admin') {
      console.log('❌ Registration blocked: Attempted to create admin account from frontend');
      return res.status(403).json({ message: 'Cannot create admin account from registration' });
    }

    // ============================================
    // ROLE VALIDATION: Only allow customer or provider
    // ============================================
    const allowedRoles = ['customer', 'provider'];
    const userRole = role && allowedRoles.includes(role) ? role : 'customer';
    console.log(`   ✅ Validated role: ${userRole}`);

    // ============================================
    // CHECK FOR EXISTING USER
    // ============================================
    console.log('   🔍 Checking for existing user...');
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      console.log(`❌ Registration failed: User already exists (${userExists.email})`);
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }
    console.log('   ✅ No existing user found');

    // ============================================
    // CREATE USER ACCOUNT
    // ============================================
    console.log('   💾 Creating user account...');
    const user = await User.create({
      name,
      email,
      phone,
      password, // Will be hashed by User model's pre-save hook
      role: userRole
    });
    console.log(`   ✅ User created with ID: ${user._id}`);

    // ============================================
    // PROVIDER-SPECIFIC SETUP
    // ============================================
    if (userRole === 'provider') {
      console.log('   🏪 Setting up provider profile...');
      
      // Validate provider-specific fields
      if (!shopName || !address || !location || !location.lat || !location.lng) {
        console.log('❌ Provider registration failed: Missing required fields');
        // Rollback: Delete the user if provider profile creation fails
        await User.findByIdAndDelete(user._id);
        console.log('   🔄 User account rolled back');
        return res.status(400).json({ 
          message: 'Provider registration requires shop name, address, and location' 
        });
      }

      // Create provider profile
      console.log('   📍 Creating provider profile...');
      await ProviderProfile.create({
        userId: user._id,
        shopName,
        address,
        location: {
          lat: location.lat,
          lng: location.lng
        },
        serviceRadius: serviceRadius || 10, // Default 10km
        isApproved: false, // Requires admin approval
        isAvailable: true
      });
      console.log('   ✅ Provider profile created');

      // Create default payment config
      console.log('   💳 Creating payment configuration...');
      await PaymentConfig.create({
        providerId: user._id,
        upiId: '',
        qrCode: '',
        codEnabled: true,
        pickupCharge: 0,
        deliveryCharge: 0,
        distanceRate: 0
      });
      console.log('   ✅ Payment config created');
    }

    // ============================================
    // GENERATE JWT TOKEN AND SEND RESPONSE
    // ============================================
    console.log('   🔑 Generating JWT token...');
    const token = generateToken(user._id);
    
    const responseMessage = userRole === 'provider' 
      ? 'Provider account created. Awaiting admin approval.' 
      : 'Account created successfully';
    
    console.log(`✅ Registration successful: ${email} (${userRole})`);
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token,
        message: responseMessage
      });
    }
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    console.error('   Stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ============================================
export const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt started');
    const { email, password } = req.body;

    console.log(`   📧 Email: ${email}`);
    console.log(`   🔑 Password: ${password ? '***' + password.slice(-2) : 'missing'}`);

    // ============================================
    // FIND USER BY EMAIL
    // ============================================
    console.log('   🔍 Searching for user in database...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log(`❌ Login failed: User not found (${email})`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log(`   ✅ User found: ${user.name} (${user.role})`);
    console.log(`   📝 User ID: ${user._id}`);

    // ============================================
    // CHECK IF USER IS BLOCKED
    // ============================================
    if (user.isBlocked) {
      console.log(`❌ Login failed: User is blocked (${email})`);
      return res.status(403).json({ message: 'Your account has been blocked' });
    }
    console.log('   ✅ User is not blocked');

    // ============================================
    // VERIFY PASSWORD
    // ============================================
    console.log('   🔐 Verifying password...');
    console.log(`   📊 Stored password hash: ${user.password.substring(0, 20)}...`);
    
    const isMatch = await user.comparePassword(password);
    console.log(`   🎯 Password match result: ${isMatch}`);
    
    if (!isMatch) {
      console.log(`❌ Login failed: Invalid password for ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('   ✅ Password verified successfully');

    // ============================================
    // GENERATE JWT TOKEN AND SEND RESPONSE
    // ============================================
    console.log('   🔑 Generating JWT token...');
    const token = generateToken(user._id);
    console.log(`   ✅ Token generated: ${token.substring(0, 20)}...`);

    console.log(`✅ Login successful: ${email} (${user.role})`);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    console.error('   Stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private (requires authentication)
// ============================================
export const getMe = async (req, res) => {
  try {
    console.log('👤 Get current user request');
    console.log(`   🔍 User ID from token: ${req.user._id}`);
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`✅ User retrieved: ${user.email} (${user.role})`);
    res.json(user);
  } catch (error) {
    console.error('❌ Get user error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
