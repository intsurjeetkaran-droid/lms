import express from 'express';
import {
  getAllUsers,
  toggleBlockUser,
  approveProvider,
  getAllOrders,
  getDashboardStats
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.put('/providers/:id/approve', approveProvider);
router.get('/orders', getAllOrders);
router.get('/stats', getDashboardStats);

export default router;
