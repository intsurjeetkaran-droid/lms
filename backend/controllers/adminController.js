import User from '../models/User.js';
import Order from '../models/Order.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Complaint from '../models/Complaint.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin)
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ 
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve provider
// @route   PUT /api/admin/providers/:id/approve
// @access  Private (Admin)
export const approveProvider = async (req, res) => {
  try {
    const profile = await ProviderProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    profile.isApproved = true;
    await profile.save();

    res.json({ message: 'Provider approved successfully', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name phone')
      .populate('providerId', 'name phone')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalOrders = await Order.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      totalUsers,
      totalCustomers,
      totalProviders,
      totalOrders,
      pendingComplaints,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
