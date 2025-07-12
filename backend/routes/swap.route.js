const express = require('express');
const router = express.Router();
// You will create this controller file
const swapsController = require('../controllers/swap.controller');
const auth = require('../middleware/auth');

router.get('/', swapsController.getAllSwaps);
router.get('/:id', swapsController.getSwapById);
router.post('/', auth, swapsController.createSwap);
router.put('/:id', auth, swapsController.updateSwap);
router.delete('/:id', auth, swapsController.deleteSwap);

module.exports = router;