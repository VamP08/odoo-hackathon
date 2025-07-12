import express from 'express';
import { getAllCategories, createCategory } from '../controllers/category.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', auth, createCategory);

export default router;
