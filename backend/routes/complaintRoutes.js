import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getProviderComplaints,
  getAllComplaints,
  updateComplaintStatus
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('customer'), createComplaint);
router.get('/my-complaints', authorize('customer'), getMyComplaints);
router.get('/provider-complaints', authorize('provider'), getProviderComplaints);
router.get('/', authorize('admin'), getAllComplaints);
router.put('/:id', authorize('admin'), updateComplaintStatus);

export default router;
