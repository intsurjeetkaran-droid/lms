import ProviderProfile from '../models/ProviderProfile.js';
import PaymentConfig from '../models/PaymentConfig.js';
import { calculateDistance } from '../utils/calculateDistance.js';

// @desc    Create provider profile
// @route   POST /api/providers/profile
// @access  Private (Provider)
export const createProfile = async (req, res) => {
  try {
    const { shopName, address, location, serviceRadius } = req.body;

    const existingProfile = await ProviderProfile.findOne({ userId: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = await ProviderProfile.create({
      userId: req.user._id,
      shopName,
      address,
      location,
      serviceRadius: serviceRadius || 5
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider profile
// @route   GET /api/providers/profile
// @access  Private (Provider)
export const getProfile = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user._id }).populate('userId', 'name email phone');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update provider profile
// @route   PUT /api/providers/profile
// @access  Private (Provider)
export const updateProfile = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.shopName = req.body.shopName || profile.shopName;
    profile.address = req.body.address || profile.address;
    profile.location = req.body.location || profile.location;
    profile.serviceRadius = req.body.serviceRadius || profile.serviceRadius;
    profile.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : profile.isAvailable;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby providers
// @route   GET /api/providers/nearby
// @access  Public
export const getNearbyProviders = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const providers = await ProviderProfile.find({ 
      isApproved: true, 
      isAvailable: true 
    }).populate('userId', 'name phone');

    const nearbyProviders = providers.filter(provider => {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        provider.location.lat,
        provider.location.lng
      );
      return distance <= provider.serviceRadius;
    });

    res.json(nearbyProviders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Setup payment config
// @route   POST /api/providers/payment-config
// @access  Private (Provider)
export const setupPaymentConfig = async (req, res) => {
  try {
    const { upiId, qrCode, codEnabled, pickupCharge, deliveryCharge, distanceRate } = req.body;

    let config = await PaymentConfig.findOne({ providerId: req.user._id });

    if (config) {
      config.upiId = upiId || config.upiId;
      config.qrCode = qrCode || config.qrCode;
      config.codEnabled = codEnabled !== undefined ? codEnabled : config.codEnabled;
      config.pickupCharge = pickupCharge !== undefined ? pickupCharge : config.pickupCharge;
      config.deliveryCharge = deliveryCharge !== undefined ? deliveryCharge : config.deliveryCharge;
      config.distanceRate = distanceRate !== undefined ? distanceRate : config.distanceRate;
      
      await config.save();
    } else {
      config = await PaymentConfig.create({
        providerId: req.user._id,
        upiId,
        qrCode,
        codEnabled,
        pickupCharge,
        deliveryCharge,
        distanceRate
      });
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment config
// @route   GET /api/providers/payment-config/:providerId
// @access  Public
export const getPaymentConfig = async (req, res) => {
  try {
    const config = await PaymentConfig.findOne({ providerId: req.params.providerId });
    
    if (!config) {
      return res.status(404).json({ message: 'Payment config not found' });
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
