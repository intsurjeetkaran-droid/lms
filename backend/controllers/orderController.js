import Order from '../models/Order.js';
import PaymentConfig from '../models/PaymentConfig.js';
import ProviderProfile from '../models/ProviderProfile.js';
import PriceRange from '../models/PriceRange.js';
import { calculateDistance } from '../utils/calculateDistance.js';

// @desc    Create order
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (req, res) => {
  try {
    const { providerId, items, pickupLocation } = req.body;

    // Get provider location and payment config
    const provider = await ProviderProfile.findOne({ userId: providerId });
    const paymentConfig = await PaymentConfig.findOne({ providerId });

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Calculate distance
    const distance = calculateDistance(
      pickupLocation.lat,
      pickupLocation.lng,
      provider.location.lat,
      provider.location.lng
    );

    // Calculate charges
    const pickupCharge = paymentConfig?.pickupCharge || 0;
    const deliveryCharge = paymentConfig?.deliveryCharge || 0;
    const distanceCharge = distance * (paymentConfig?.distanceRate || 5);

    // Calculate item prices
    let itemsTotal = 0;
    const processedItems = items.map(item => {
      const itemTotal = item.basePrice * item.quantity;
      itemsTotal += itemTotal;
      return {
        ...item,
        finalPrice: item.isCustom ? 0 : itemTotal
      };
    });

    const totalPrice = itemsTotal + pickupCharge + deliveryCharge + distanceCharge;

    const order = await Order.create({
      customerId: req.user._id,
      providerId,
      items: processedItems,
      pickupLocation,
      distance,
      charges: {
        pickup: pickupCharge,
        delivery: deliveryCharge,
        distance: distanceCharge,
        extra: 0
      },
      totalPrice
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('providerId', 'name')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider orders
// @route   GET /api/orders/provider-orders
// @access  Private (Provider)
export const getProviderOrders = async (req, res) => {
  try {
    const orders = await Order.find({ providerId: req.user._id })
      .populate('customerId', 'name phone')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name phone')
      .populate('providerId', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (
      order.customerId._id.toString() !== req.user._id.toString() &&
      order.providerId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Review order (Provider)
// @route   PUT /api/orders/:id/review
// @access  Private (Provider)
export const reviewOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'awaiting_review') {
      return res.status(400).json({ message: 'Order cannot be reviewed' });
    }

    const { items, extraCharge } = req.body;

    // Get this provider's price range for custom item validation
    let priceRange = await PriceRange.findOne({ providerId: req.user._id });
    if (!priceRange) {
      priceRange = { minPrice: 20, maxPrice: 100 };
    }

    // Validate custom item prices against provider's range
    if (items) {
      for (const item of items) {
        const orderItem = order.items.find(i => i.name === item.name);
        if (orderItem && orderItem.isCustom) {
          // finalPrice in the payload is price-per-item * quantity
          const pricePerItem = item.quantity > 0 ? item.finalPrice / item.quantity : item.finalPrice;
          if (pricePerItem < priceRange.minPrice || pricePerItem > priceRange.maxPrice) {
            return res.status(400).json({
              message: `Price for "${item.name}" must be between ₹${priceRange.minPrice} and ₹${priceRange.maxPrice} per item`,
              minPrice: priceRange.minPrice,
              maxPrice: priceRange.maxPrice
            });
          }
        }
      }
    }

    // Update custom item prices
    if (items) {
      order.items = order.items.map(item => {
        const updatedItem = items.find(i => i.name === item.name);
        if (updatedItem && item.isCustom) {
          return {
            ...item.toObject(),
            finalPrice: updatedItem.finalPrice
          };
        }
        return item;
      });
    }

    // Update extra charges
    if (extraCharge !== undefined) {
      order.charges.extra = extraCharge;
    }

    // Recalculate total
    const itemsTotal = order.items.reduce((sum, item) => sum + item.finalPrice, 0);
    order.totalPrice = itemsTotal + 
      order.charges.pickup + 
      order.charges.delivery + 
      order.charges.distance + 
      order.charges.extra;

    order.status = 'confirmed';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Provider)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    const validStatuses = ['confirmed', 'picked_up', 'processing', 'delivered', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Customer)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['awaiting_review', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
