import express from 'express';
import { updatePaymentStatus, getPaymentDetails } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/:orderId')
  .get(getPaymentDetails)
  .put(updatePaymentStatus);

export default router;
