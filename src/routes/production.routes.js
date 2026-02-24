const express = require('express');
const router = express.Router();

const productionController = require('../controller/productionController');

router.get('/production', productionController.getProduction.bind(productionController));
router.patch('/production/plan', productionController.calculatePlan);
router.post('/production/output', productionController.createOutput.bind(productionController));

module.exports = router;