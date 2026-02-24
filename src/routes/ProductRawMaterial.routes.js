const express = require('express');
const router = express.Router();

const ProductRawMaterialController = require('../controller/ProductRawMaterialController');
const controller = new ProductRawMaterialController();

router.get('/product-raw-materials', controller.catchAll.bind(controller));
router.get('/product-raw-materials/:id', controller.pickOne.bind(controller));
router.post('/product-raw-materials', controller.create.bind(controller));
router.patch('/product-raw-materials/:id', controller.updateField.bind(controller));
router.delete('/product-raw-materials/:id', controller.delete.bind(controller));

module.exports = router;