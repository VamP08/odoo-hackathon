import express from 'express';
import auth from '../middleware/auth.js';
import {getAllUsers,getUserById,createUser,updateUser,deleteUser} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', auth, getAllUsers); // admin only
router.get('/:id', auth, getUserById);
router.post('/', createUser); // registration, no auth
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

export default router;