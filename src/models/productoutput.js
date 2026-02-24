'use strict';

module.exports = (sequelize, DataTypes) => {
  const ProductOutput = sequelize.define(
    'ProductOutput',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },

      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'productId', // 👈 coluna real
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'unitPrice',
      },

      totalValue: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'totalValue',
      },
    },
    {
      tableName: 'product_outputs', // 👈 nome da tabela do print
      timestamps: true,
      underscored: false, // 👈 MUITO IMPORTANTE
    }
  );

  ProductOutput.associate = (models) => {
    ProductOutput.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  };

  return ProductOutput;
};