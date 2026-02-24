const Controller = require('./Controller');
const ServicesRawMaterial = require('../services/ServicesProductRawMaterial');

class ProductRawMaterialController extends Controller {
    constructor() {
        super(new ServicesRawMaterial(), 'ProductRawMaterial');
    }
}

module.exports = ProductRawMaterialController;