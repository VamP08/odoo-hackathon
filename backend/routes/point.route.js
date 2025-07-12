import express from 'express';
import {getAllPointTransactions,getPointTransactionById,createPointTransaction} from '../controllers/point.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Only authenticated users should access their own point transactions.
// Creating a point transaction should also require authentication.

router.get('/', auth, getAllPointTransactions);         // Protected: only logged-in users
router.get('/:id', auth, getPointTransactionById);      // Protected: only logged-in users
router.post('/', auth, createPointTransaction);         // Protected: only logged-in users

export default router;