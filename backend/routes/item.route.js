const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const auth = require('../middleware/auth');

router.get('/', itemsController.getAllItems);
router.get('/:id', itemsController.getItemById);
router.post('/', auth, itemsController.createItem);
router.put('/:id', auth, itemsController.updateItem);
router.delete('/:id', auth, itemsController.deleteItem);

module.exports = router;