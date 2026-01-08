import express from 'express';
import {
  createReservation,
  getOutletReservations,
  updateReservationStatus,
} from '../controllers/reservationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/public/reservations', createReservation);

// Manager Routes
router.get(
  '/manager/reservations/:outletId',
  protect,
  authorize('OUTLET_MANAGER', 'SUPER_ADMIN'),
  getOutletReservations
);
router.put(
  '/manager/reservations/:id',
  protect,
  authorize('OUTLET_MANAGER', 'SUPER_ADMIN'),
  updateReservationStatus
);

export default router;
