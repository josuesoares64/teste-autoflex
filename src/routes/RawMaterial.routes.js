const express = require('express');
const router = express.Router();

const RawMaterialController = require('../controller/rawMaterialController');
const controller = new RawMaterialController();

router.get('/raw-materials', controller.catchAll.bind(controller));
router.get('/raw-materials/:id', controller.pickOne.bind(controller));
router.post('/raw-materials', controller.create.bind(controller));
router.patch('/raw-materials/:id', controller.updateField.bind(controller));
router.delete('/raw-materials/:id', controller.delete.bind(controller));

module.exports = router;