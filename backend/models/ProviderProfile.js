import mongoose from 'mongoose';

const providerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  serviceRadius: {
    type: Number,
    default: 5,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ProviderProfile', providerProfileSchema);
