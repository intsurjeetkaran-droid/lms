import Order from '../models/Order.js';

// @desc    Update payment status
// @route   PUT /api/payments/:orderId
// @access  Private
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (
      order.customerId.toString() !== req.user._id.toString() &&
      order.providerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.paymentMethod = paymentMethod;
    order.paymentStatus = 'paid';
    
    if (transactionId) {
      order.transactionId = transactionId;
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:orderId
// @access  Private
export const getPaymentDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .select('totalPrice paymentMethod paymentStatus transactionId charges');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
