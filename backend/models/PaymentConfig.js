import mongoose from 'mongoose';

const paymentConfigSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  upiId: {
    type: String,
    trim: true
  },
  qrCode: {
    type: String
  },
  codEnabled: {
    type: Boolean,
    default: true
  },
  pickupCharge: {
    type: Number,
    default: 0
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  distanceRate: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('PaymentConfig', paymentConfigSchema);
