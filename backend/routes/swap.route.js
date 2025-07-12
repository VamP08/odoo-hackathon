import express from 'express';

const router = express.Router();
import swapsController from '../controllers/swap.controller.js';
import auth from '../middleware/auth.js';

// Only authenticated users should be able to create, update, or delete swaps.
// Listing and viewing swaps can be public or protected based on your app's needs.
// Usually, at least creating, updating, and deleting require auth.

router.get('/', auth, swapsController.getAllSwaps);         // Usually protected (show only user-related swaps)
router.get('/:id', auth, swapsController.getSwapById);      // Protected (user can see their own swap)
router.post('/', auth, swapsController.createSwap);         // Protected (only logged-in users can request swaps)
router.put('/:id', auth, swapsController.updateSwap);       // Protected (only involved users/admin can update)
router.delete('/:id', auth, swapsController.deleteSwap);    // Protected (only involved users/admin can delete)

export default router;