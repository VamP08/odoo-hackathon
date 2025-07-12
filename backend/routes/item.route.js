import express from 'express';
const router = express.Router();
import {getAllItems,getItemById,createItem,updateItem,deleteItem,getFeaturedItems} from '../controllers/item.controller.js';
import auth from '../middleware/auth.js';

// Public: anyone can view items
router.get('/', getAllItems);
router.get('/featured', auth, getFeaturedItems);
router.get('/:id', getItemById);

// Protected: only authenticated users can create, update, or delete items
router.post('/', auth, createItem);
router.put('/:id', auth, updateItem);
router.delete('/:id', auth, deleteItem);

export default router;