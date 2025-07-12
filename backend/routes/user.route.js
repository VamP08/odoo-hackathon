import express from 'express';

const router = express.Router();
const usersController = require('../controllers/user.controller'); 
const auth = require('../middleware/auth');

router.get('/', auth, usersController.getAllUsers); // admin only
router.get('/:id', auth, usersController.getUserById);
router.post('/', usersController.createUser); // registration, no auth
router.put('/:id', auth, usersController.updateUser);
router.delete('/:id', auth, usersController.deleteUser);

export default router;