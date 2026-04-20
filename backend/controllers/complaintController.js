import Complaint from '../models/Complaint.js';
import Order from '../models/Order.js';

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private (Customer)
export const createComplaint = async (req, res) => {
  try {
    const { orderId, type, description } = req.body;

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const complaint = await Complaint.create({
      orderId,
      customerId: req.user._id,
      providerId: order.providerId,
      type,
      description
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my complaints
// @route   GET /api/complaints/my-complaints
// @access  Private (Customer)
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ customerId: req.user._id })
      .populate('orderId')
      .populate('providerId', 'name')
      .sort('-createdAt');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider complaints
// @route   GET /api/complaints/provider-complaints
// @access  Private (Provider)
export const getProviderComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ providerId: req.user._id })
      .populate('orderId')
      .populate('customerId', 'name phone')
      .sort('-createdAt');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin)
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('orderId')
      .populate('customerId', 'name phone')
      .populate('providerId', 'name phone')
      .sort('-createdAt');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private (Admin)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status || complaint.status;
    complaint.adminResponse = adminResponse || complaint.adminResponse;

    if (status === 'resolved' || status === 'rejected') {
      complaint.resolvedAt = Date.now();
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
