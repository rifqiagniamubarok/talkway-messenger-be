const express = require('express');
const router = express.Router();
const exampleRoutes = require('./example');

router.use('/', exampleRoutes);

module.exports = router;
