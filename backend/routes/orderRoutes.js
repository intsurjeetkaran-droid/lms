import express from 'express';
import {
  createOrder,
  getMyOrders,
  getProviderOrders,
  getOrderById,
  reviewOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { orderValidation, validate } from '../middleware/validator.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('customer'), orderValidation, validate, createOrder);
router.get('/my-orders', authorize('customer'), getMyOrders);
router.get('/provider-orders', authorize('provider'), getProviderOrders);
router.get('/:id', getOrderById);
router.put('/:id/review', authorize('provider'), reviewOrder);
router.put('/:id/status', authorize('provider'), updateOrderStatus);
router.put('/:id/cancel', authorize('customer'), cancelOrder);

export default router;
