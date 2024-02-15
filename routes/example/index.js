const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/example');

router.get('/', controllers.getExample);

module.exports = router;
