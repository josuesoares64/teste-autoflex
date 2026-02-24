'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const [products] = await queryInterface.sequelize.query(
      `SELECT id FROM "Products";`
    );

    const [rawMaterials] = await queryInterface.sequelize.query(
      `SELECT id FROM "RawMaterials";`
    );

    const relations = [];

    for (let i = 0; i < 10; i++) {
      relations.push({
        id: uuidv4(),
        productId: products[i % products.length].id,
        rawMaterialId: rawMaterials[i % rawMaterials.length].id,
        quantity: (Math.random() * 5 + 1).toFixed(2),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('ProductRawMaterials', relations);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ProductRawMaterials', null, {});
  }
};