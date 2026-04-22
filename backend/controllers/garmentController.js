import Garment from '../models/Garment.js';
import PriceRange from '../models/PriceRange.js';

// Helper: get or create a provider's price range (defaults to 20–100)
const getProviderRange = async (providerId) => {
  let range = await PriceRange.findOne({ providerId });
  if (!range) {
    range = await PriceRange.create({ providerId, minPrice: 20, maxPrice: 100 });
  }
  return range;
};

// @desc    Get this provider's custom item price range (public — customers use this)
// @route   GET /api/garments/price-range/:providerId
// @access  Public
export const getProviderPriceRange = async (req, res) => {
  try {
    const range = await getProviderRange(req.params.providerId);
    res.json({ minPrice: range.minPrice, maxPrice: range.maxPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in provider's own price range
// @route   GET /api/garments/my-price-range
// @access  Private (Provider)
export const getMyPriceRange = async (req, res) => {
  try {
    const range = await getProviderRange(req.user._id);
    res.json({ minPrice: range.minPrice, maxPrice: range.maxPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update logged-in provider's custom item price range
// @route   PUT /api/garments/my-price-range
// @access  Private (Provider)
export const updateMyPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;

    if (minPrice === undefined || maxPrice === undefined) {
      return res.status(400).json({ message: 'Both minPrice and maxPrice are required' });
    }

    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (isNaN(min) || isNaN(max)) {
      return res.status(400).json({ message: 'Prices must be valid numbers' });
    }
    if (min < 0 || max < 0) {
      return res.status(400).json({ message: 'Prices cannot be negative' });
    }
    if (max <= min) {
      return res.status(400).json({ message: 'Maximum price must be greater than minimum price' });
    }

    let range = await PriceRange.findOne({ providerId: req.user._id });
    if (range) {
      range.minPrice = min;
      range.maxPrice = max;
      await range.save();
    } else {
      range = await PriceRange.create({ providerId: req.user._id, minPrice: min, maxPrice: max });
    }

    res.json({ message: 'Price range updated successfully', minPrice: range.minPrice, maxPrice: range.maxPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create garment — price validated against provider's own range
// @route   POST /api/garments
// @access  Private (Provider)
export const createGarment = async (req, res) => {
  try {
    const { name, price } = req.body;
    const range = await getProviderRange(req.user._id);
    const numericPrice = Number(price);

    if (isNaN(numericPrice) || numericPrice < range.minPrice || numericPrice > range.maxPrice) {
      return res.status(400).json({
        message: `Price must be between ₹${range.minPrice} and ₹${range.maxPrice}`,
        minPrice: range.minPrice,
        maxPrice: range.maxPrice
      });
    }

    const garment = await Garment.create({
      providerId: req.user._id,
      name,
      price: numericPrice
    });

    res.status(201).json(garment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active garments for a provider (public)
// @route   GET /api/garments/provider/:providerId
// @access  Public
export const getProviderGarments = async (req, res) => {
  try {
    const garments = await Garment.find({
      providerId: req.params.providerId,
      isActive: true
    });
    res.json(garments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my garments
// @route   GET /api/garments/my-garments
// @access  Private (Provider)
export const getMyGarments = async (req, res) => {
  try {
    const garments = await Garment.find({ providerId: req.user._id });
    res.json(garments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update garment — price validated against provider's own range
// @route   PUT /api/garments/:id
// @access  Private (Provider)
export const updateGarment = async (req, res) => {
  try {
    const garment = await Garment.findById(req.params.id);

    if (!garment) {
      return res.status(404).json({ message: 'Garment not found' });
    }
    if (garment.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.body.price !== undefined) {
      const range = await getProviderRange(req.user._id);
      const numericPrice = Number(req.body.price);

      if (isNaN(numericPrice) || numericPrice < range.minPrice || numericPrice > range.maxPrice) {
        return res.status(400).json({
          message: `Price must be between ₹${range.minPrice} and ₹${range.maxPrice}`,
          minPrice: range.minPrice,
          maxPrice: range.maxPrice
        });
      }
      garment.price = numericPrice;
    }

    garment.name = req.body.name || garment.name;
    garment.isActive = req.body.isActive !== undefined ? req.body.isActive : garment.isActive;

    const updatedGarment = await garment.save();
    res.json(updatedGarment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete garment
// @route   DELETE /api/garments/:id
// @access  Private (Provider)
export const deleteGarment = async (req, res) => {
  try {
    const garment = await Garment.findById(req.params.id);

    if (!garment) {
      return res.status(404).json({ message: 'Garment not found' });
    }
    if (garment.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await garment.deleteOne();
    res.json({ message: 'Garment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
