const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/message.controller');
const auth = require('../middleware/auth');

router.get('/', messagesController.getAllMessages);
router.get('/:id', messagesController.getMessageById);
router.post('/', auth, messagesController.createMessage);
router.put('/:id', auth, messagesController.updateMessage);
router.delete('/:id', auth, messagesController.deleteMessage);

module.exports = router;