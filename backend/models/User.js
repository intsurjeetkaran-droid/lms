import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ============================================
// USER SCHEMA DEFINITION
// ============================================
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't include password in queries by default (security)
  },
  role: {
    type: String,
    enum: ['customer', 'provider', 'admin'],
    default: 'customer'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ============================================
// PRE-SAVE HOOK: Hash password before saving to database
// ============================================
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    console.log('   ⏭️  Password not modified, skipping hash');
    next();
  }
  
  console.log('   🔐 Hashing password...');
  console.log(`   📝 Plain password length: ${this.password.length}`);
  
  // Generate salt (random data for hashing)
  const salt = await bcrypt.genSalt(10);
  console.log(`   🧂 Salt generated: ${salt.substring(0, 15)}...`);
  
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
  console.log(`   ✅ Password hashed: ${this.password.substring(0, 20)}...`);
  console.log(`   📊 Hash length: ${this.password.length}`);
});

// ============================================
// INSTANCE METHOD: Compare entered password with hashed password
// ============================================
userSchema.methods.comparePassword = async function(enteredPassword) {
  console.log('   🔍 Comparing passwords...');
  console.log(`   📝 Entered password length: ${enteredPassword.length}`);
  console.log(`   📊 Stored hash length: ${this.password.length}`);
  console.log(`   🔐 Stored hash: ${this.password.substring(0, 20)}...`);
  
  // Use bcrypt to compare plain text password with hashed password
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log(`   🎯 Comparison result: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
  
  return isMatch;
};

export default mongoose.model('User', userSchema);
