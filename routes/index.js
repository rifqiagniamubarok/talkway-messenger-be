const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const messageRoutes = require('./message');
const messagesRoutes = require('./messages');
const AuthValidation = require('../middlewares/AuthValidation');

router.use('/', authRoutes);
router.use('/message', AuthValidation, messageRoutes);
router.use('/messages', AuthValidation, messagesRoutes);

module.exports = router;
