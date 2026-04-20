import express from 'express';
import {
  createGarment,
  getProviderGarments,
  getMyGarments,
  updateGarment,
  deleteGarment
} from '../controllers/garmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/provider/:providerId', getProviderGarments);

router.use(protect);
router.use(authorize('provider'));

router.route('/')
  .post(createGarment);

router.get('/my-garments', getMyGarments);

router.route('/:id')
  .put(updateGarment)
  .delete(deleteGarment);

export default router;
