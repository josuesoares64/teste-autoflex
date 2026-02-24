"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductRawMaterial extends Model {
    static associate(models) {
      ProductRawMaterial.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });

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
    },
  );

  return ProductRawMaterial;
};
