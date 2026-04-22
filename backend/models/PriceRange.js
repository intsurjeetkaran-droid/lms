import mongoose from 'mongoose';

const priceRangeSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // one range doc per provider
  },
  minPrice: {
    type: Number,
    required: true,
    default: 20,
    min: 0
  },
  maxPrice: {
    type: Number,
    required: true,
    default: 100,
    min: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

priceRangeSchema.pre('save', function (next) {
  if (this.maxPrice <= this.minPrice) {
    return next(new Error('Maximum price must be greater than minimum price'));
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('PriceRange', priceRangeSchema);
