'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.renameTable('ProductOutputs', 'product_outputs');
  },

  async down(queryInterface) {
    await queryInterface.renameTable('product_outputs', 'ProductOutputs');
  },
};