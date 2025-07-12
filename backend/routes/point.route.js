const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/point.controller');
const auth = require('../middleware/auth');

router.get('/', pointsController.getAllPointTransactions);
router.get('/:id', pointsController.getPointTransactionById);
router.post('/', auth, pointsController.createPointTransaction);

module.exports = router;