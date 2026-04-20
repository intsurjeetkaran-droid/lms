import Garment from '../models/Garment.js';

// @desc    Create garment
// @route   POST /api/garments
// @access  Private (Provider)
export const createGarment = async (req, res) => {
  try {
    const { name, price } = req.body;

    const garment = await Garment.create({
      providerId: req.user._id,
      name,
      price
    });

    res.status(201).json(garment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all garments for a provider
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

// @desc    Update garment
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

    garment.name = req.body.name || garment.name;
    garment.price = req.body.price !== undefined ? req.body.price : garment.price;
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
