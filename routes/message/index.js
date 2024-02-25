const express = require('express');
const router = express.Router();
const controller = require('../../controllers/message');

router.post('/start-message', controller.startMessage);
router.get('/:room_chat_id', controller.joinMessage);
router.post('/:room_chat_id', controller.sendMessage);

module.exports = router;
