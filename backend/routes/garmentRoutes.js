import express from 'express';
import {
  createGarment,
  getProviderGarments,
  getMyGarments,
  updateGarment,
  deleteGarment,
  getProviderPriceRange,
  getMyPriceRange,
  updateMyPriceRange
} from '../controllers/garmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/price-range/:providerId', getProviderPriceRange);
router.get('/provider/:providerId', getProviderGarments);

// Protected provider routes
router.use(protect);
router.use(authorize('provider'));

router.get('/my-price-range', getMyPriceRange);
router.put('/my-price-range', updateMyPriceRange);

router.route('/').post(createGarment);
router.get('/my-garments', getMyGarments);

router.route('/:id')
  .put(updateGarment)
  .delete(deleteGarment);

export default router;
