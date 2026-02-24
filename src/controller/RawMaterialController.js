const controller = require('./Controller');
const ServicesRawMaterial = require('../services/ServicesRawMaterial');

class RawMaterialController extends controller {
    constructor() {
        super(new ServicesRawMaterial(), 'RawMaterial');
    }
}

module.exports = RawMaterialController;