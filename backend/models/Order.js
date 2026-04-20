import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    basePrice: {
      type: Number,
      required: true
    },
    finalPrice: {
      type: Number,
      default: 0
    },
    isCustom: {
      type: Boolean,
      default: false
    }
  }],
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  distance: {
    type: Number,
    default: 0
  },
  charges: {
    pickup: {
      type: Number,
      default: 0
    },
    delivery: {
      type: Number,
      default: 0
    },
    distance: {
      type: Number,
      default: 0
    },
    extra: {
      type: Number,
      default: 0
    }
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['awaiting_review', 'confirmed', 'picked_up', 'processing', 'delivered', 'completed', 'cancelled'],
    default: 'awaiting_review'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'cod'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Order', orderSchema);
