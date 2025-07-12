import express from 'express';
import pointsController from '../controllers/point.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Only authenticated users should access their own point transactions.
// Creating a point transaction should also require authentication.

router.get('/', auth, pointsController.getAllPointTransactions);         // Protected: only logged-in users
router.get('/:id', auth, pointsController.getPointTransactionById);      // Protected: only logged-in users
router.post('/', auth, pointsController.createPointTransaction);         // Protected: only logged-in users

export default router;