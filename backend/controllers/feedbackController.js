import Feedback from '../models/Feedback.js';
import Order from '../models/Order.js';

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private (Customer)
export const createFeedback = async (req, res) => {
  try {
    const { orderId, rating, review } = req.body;

    // Check if order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'delivered' && order.status !== 'completed') {
      return res.status(400).json({ message: 'Can only give feedback after delivery' });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ orderId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted' });
    }

    const feedback = await Feedback.create({
      orderId,
      customerId: req.user._id,
      providerId: order.providerId,
      rating,
      review
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider feedback
// @route   GET /api/feedback/provider/:providerId
// @access  Public
export const getProviderFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ providerId: req.params.providerId })
      .populate('customerId', 'name')
      .populate('orderId', 'createdAt')
      .sort('-createdAt');

    // Calculate average rating
    const avgRating = feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
      : 0;

    res.json({
      feedback,
      averageRating: avgRating.toFixed(1),
      totalReviews: feedback.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order feedback
// @route   GET /api/feedback/order/:orderId
// @access  Private
export const getOrderFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ orderId: req.params.orderId })
      .populate('customerId', 'name');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
