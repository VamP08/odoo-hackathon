import express from 'express';
import auth from '../middleware/auth.js';
import usersController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', auth, usersController.getAllUsers); // admin only
router.get('/:id', auth, usersController.getUserById);
router.post('/', usersController.createUser); // registration, no auth
router.put('/:id', auth, usersController.updateUser);
router.delete('/:id', auth, usersController.deleteUser);

export default router;