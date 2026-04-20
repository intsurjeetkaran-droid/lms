import express from 'express';
import {
  createFeedback,
  getProviderFeedback,
  getOrderFeedback
} from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/provider/:providerId', getProviderFeedback);
router.get('/order/:orderId', getOrderFeedback);

router.use(protect);
router.post('/', authorize('customer'), createFeedback);

export default router;
