import express from 'express';

const router = express.Router();
import {getAllSwaps,getSwapById,createSwap,updateSwap,deleteSwap} from '../controllers/swap.controller.js';
import auth from '../middleware/auth.js';

// Only authenticated users should be able to create, update, or delete swaps.
// Listing and viewing swaps can be public or protected based on your app's needs.
// Usually, at least creating, updating, and deleting require auth.

router.get('/', auth, getAllSwaps);         // Usually protected (show only user-related swaps)
router.get('/:id', auth, getSwapById);      // Protected (user can see their own swap)
router.post('/', auth, createSwap);         // Protected (only logged-in users can request swaps)
router.put('/:id', auth, updateSwap);       // Protected (only involved users/admin can update)
router.delete('/:id', auth, deleteSwap);    // Protected (only involved users/admin can delete)

export default router;