const Controller = require('./Controller');
const ProductsService = require('../services/ServicesProducts');

class ProductController extends Controller {
    constructor() {
        super(new ProductsService(), 'Product');
    }
}

module.exports = ProductController;