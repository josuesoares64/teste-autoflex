const Controller = require('./Controller');
const ProductsService = require('../services/ServicesProducts');

class ProductController extends Controller {
    constructor() {
        super(new ProductsService(), 'Product');
    }

    async create(req, res) {
        const data = req.body;
        try {
            const newRegister = await this.service.createWithMaterials(data);
            return res.status(201).json(newRegister);
        } catch (error) {
            // Isso vai mostrar no seu terminal EXATAMENTE qual campo falhou
            console.error("DETALHE DO ERRO:", error.errors ? error.errors.map(e => e.message) : error.message);
            return res.status(400).json({ 
                error: error.message, 
                details: error.errors ? error.errors.map(e => e.message) : [] 
            });
        }
    }
}

module.exports = ProductController;