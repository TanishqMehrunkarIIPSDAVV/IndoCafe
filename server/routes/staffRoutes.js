import express from 'express';
import { createStaff, getStaffByOutlet, deleteStaff } from '../controllers/staffController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Only Managers and Admins can manage staff
router.post('/', authorize('SUPER_ADMIN', 'OUTLET_MANAGER'), createStaff);
router.get('/:outletId', authorize('SUPER_ADMIN', 'OUTLET_MANAGER'), getStaffByOutlet);
router.delete('/:staffId', authorize('SUPER_ADMIN', 'OUTLET_MANAGER'), deleteStaff);

export default router;
