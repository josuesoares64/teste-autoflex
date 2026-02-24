"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RawMaterial extends Model {
    static associate(models) {
      RawMaterial.belongsToMany(models.Product, {
        through: models.ProductRawMaterial,
        foreignKey: "rawMaterialId",
        otherKey: "productId",
        as: "products",
      });
    }
  }

  RawMaterial.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stockQuantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RawMaterial",
      tableName: "RawMaterials",
    },
  );

  return RawMaterial;
};
