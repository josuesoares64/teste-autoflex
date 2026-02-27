const Services = require('./Services');
const database = require('../models');

class ProductsService extends Services {
    constructor() {
        super('Product');
    }

    // Listagem Completa
    async catchAll() {
        return database.Product.findAll({
            include: [
                {
                    model: database.ProductRawMaterial,
                    as: 'ProductRawMaterials',
                    include: [{ model: database.RawMaterial, as: 'rawMaterial' }]
                }
            ]
        });
    }

    async createWithMaterials(data) {
        const { materials, ...productData } = data;
        
        return database.sequelize.transaction(async (t) => {
            // 1. Cria o Produto
            const newProduct = await database.Product.create(productData, { transaction: t });

            // 2. Cria os vínculos
            if (materials && materials.length > 0) {
                const productMaterials = materials.map(m => ({
                    productId: newProduct.id,
                    rawMaterialId: m.rawMaterialId,
                    quantity: m.quantityNeeded 
                }));
                
                await database.ProductRawMaterial.bulkCreate(productMaterials, { transaction: t });
            }

            // 3. RETORNO COMPLETO: Busca o produto recém-criado com os materiais inclusos
            return await database.Product.findByPk(newProduct.id, {
                include: [
                    {
                        model: database.ProductRawMaterial,
                        as: 'ProductRawMaterials',
                        include: [{ model: database.RawMaterial, as: 'rawMaterial' }]
                    }
                ],
                transaction: t
            });
        });
    }
}

module.exports = ProductsService;