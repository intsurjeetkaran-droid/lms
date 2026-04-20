import express from 'express';
import {
  createProfile,
  getProfile,
  updateProfile,
  getNearbyProviders,
  setupPaymentConfig,
  getPaymentConfig
} from '../controllers/providerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/nearby', getNearbyProviders);
router.get('/payment-config/:providerId', getPaymentConfig);

router.use(protect);
router.use(authorize('provider'));

router.route('/profile')
  .post(createProfile)
  .get(getProfile)
  .put(updateProfile);

router.route('/payment-config')
  .post(setupPaymentConfig);

export default router;
