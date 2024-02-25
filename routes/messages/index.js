const express = require('express');
const router = express.Router();
const controller = require('../../controllers/messages');

router.get('/', controller.getMessages);
router.get('/find-number/:phone_number', controller.findNumber);

module.exports = router;
