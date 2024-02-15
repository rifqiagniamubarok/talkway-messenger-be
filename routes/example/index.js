const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/example');

router.get('/', controllers.getExample);
router.get('/:param', controllers.getDetailExample);
router.post('/', controllers.createExample);
router.put('/:param', controllers.editExample);
router.delete('/:param', controllers.deleteExample);

module.exports = router;
