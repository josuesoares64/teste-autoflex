const express = require('express');
const router = express.Router();

const ProductController = require('../controller/productController');
const productController = new ProductController();

router.get('/products', productController.catchAll.bind(productController));
router.get('/products/:id', productController.pickOne.bind(productController));
router.post('/products', productController.create.bind(productController));
router.patch('/products/:id', productController.updateField.bind(productController));
router.delete('/products/:id', productController.delete.bind(productController));

module.exports = router;