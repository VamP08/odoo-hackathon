import express from 'express';
const router = express.Router();
import itemsController from '../controllers/item.controller.js';
import auth from '../middleware/auth.js';

// Public: anyone can view items
router.get('/', itemsController.getAllItems);
router.get('/:id', itemsController.getItemById);

// Protected: only authenticated users can create, update, or delete items
router.post('/', auth, itemsController.createItem);
router.put('/:id', auth, itemsController.updateItem);
router.delete('/:id', auth, itemsController.deleteItem);

export default router;