"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductRawMaterial extends Model {
    static associate(models) {
      // Corrigido: Aqui deve ser no singular "product", 
      // pois este registro específico pertence a UM produto.
      ProductRawMaterial.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });

      // Aqui também pertence a UMA matéria-prima.
      ProductRawMaterial.belongsTo(models.RawMaterial, {
        foreignKey: "rawMaterialId",
        as: "rawMaterial",
      });
    }
  }

  ProductRawMaterial.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rawMaterialId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProductRawMaterial",
      tableName: "ProductRawMaterials",
    }
  );

  return ProductRawMaterial;
};