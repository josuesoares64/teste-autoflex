const db = require("../models");

// Extrai tudo que você precisa do objeto 'db'
const { sequelize, Product, RawMaterial, ProductOutput } = db;

class ProductionService {
  async calculateProduction() {
    const products = await Product.findAll({
      include: [
        {
          model: RawMaterial,
          as: "rawMaterials",
          attributes: ["id", "name", "stockQuantity"],
          through: { attributes: ["quantity"] },
        },
        {
          model: ProductOutput,
          as: "outputs",
          attributes: ["quantity", "totalValue"],
        },
      ],
      order: [["price", "DESC"]],
    });

    const productionResult = [];

    let totalPotentialValue = 0;
    let totalRealizedValue = 0;

    for (const product of products) {
      let maxPossible = Infinity;

      //  calcula produção máxima
      for (const rm of product.rawMaterials) {
        const stock = Number(rm.stockQuantity);
        const required = Number(rm.ProductRawMaterial.quantity);

        const possibleByMaterial = Math.floor(stock / required);

        if (possibleByMaterial < maxPossible) {
          maxPossible = possibleByMaterial;
        }
      }

      if (maxPossible === Infinity) maxPossible = 0;

      // 🔹 valores potenciais
      const potentialValue = maxPossible * Number(product.price);

      // 🔹 soma vendas
      const soldQuantity = product.outputs.reduce(
        (sum, o) => sum + Number(o.quantity),
        0,
      );

      const realizedValue = product.outputs.reduce(
        (sum, o) => sum + Number(o.totalValue),
        0,
      );

      const remainingQuantity = Math.max(maxPossible - soldQuantity, 0);
      const remainingValue = Math.max(potentialValue - realizedValue, 0);

      totalPotentialValue += potentialValue;
      totalRealizedValue += realizedValue;

      productionResult.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),

        possibleQuantity: maxPossible,
        soldQuantity,
        remainingQuantity,

        totalPotentialValue: Number(potentialValue.toFixed(2)),
        realizedValue: Number(realizedValue.toFixed(2)),
        remainingValue: Number(remainingValue.toFixed(2)),
      });
    }

    productionResult.sort(
      (a, b) => b.totalPotentialValue - a.totalPotentialValue,
    );

    return {
      products: productionResult,
      totalPotentialValue: Number(totalPotentialValue.toFixed(2)),
      totalRealizedValue: Number(totalRealizedValue.toFixed(2)),
    };
  }

  async registerOutput({ productId, quantity }) {
    const transaction = await sequelize.transaction();

    try {
      // Validação
      if (!productId || !quantity) {
        throw new Error("productId and quantity are required");
      }

      if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
      }

      // Buscar produto com matérias-primas
      const product = await Product.findByPk(productId, {
        include: {
          model: RawMaterial,
          as: "rawMaterials",
          attributes: ["id", "stockQuantity"],
          through: { attributes: ["quantity"] },
        },
        transaction,
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Verificar se há matéria-prima suficiente
      for (const rm of product.rawMaterials) {
        const required = Number(rm.ProductRawMaterial.quantity);
        const stock = Number(rm.stockQuantity);

        const needed = required * quantity;

        if (stock < needed) {
          throw new Error(
            `Not enough stock for raw material ${rm.id}. Required: ${needed}, Available: ${stock}`,
          );
        }
      }

      // Dar baixa nas matérias-primas
      for (const rm of product.rawMaterials) {
        const required = Number(rm.ProductRawMaterial.quantity);
        const used = required * quantity;

        await rm.update(
          {
            stockQuantity: Number(rm.stockQuantity) - used,
          },
          { transaction },
        );
      }

      const unitPrice = Number(product.price);
      const totalValue = unitPrice * quantity;

      // Registrar saída
      const output = await ProductOutput.create(
        {
          productId,
          quantity,
          unitPrice,
          totalValue,
        },
        { transaction },
      );

      await transaction.commit();

      return {
        message: "Output registered successfully",
        output,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Calcula produção considerando limites definidos pelo usuário
  async calculateWithLimits(limits = []) {
    // transforma limites em mapa
    const limitsMap = new Map(limits.map((l) => [l.productId, Number(l.max)]));

    // estoque inicial (clone)
    const rawMaterials = await RawMaterial.findAll();
    const stock = {};

    rawMaterials.forEach((rm) => {
      stock[rm.id] = Number(rm.stockQuantity);
    });

    // produtos por prioridade (maior preço primeiro)
    const products = await Product.findAll({
      include: {
        model: RawMaterial,
        as: "rawMaterials",
        attributes: ["id", "name"],
        through: { attributes: ["quantity"] },
      },
      order: [["price", "DESC"]],
    });

    const result = [];
    let totalProductionValue = 0;

    for (const product of products) {
      let maxPossible = Infinity;

      // calcula máximo possível com estoque atual
      for (const rm of product.rawMaterials) {
        const available = stock[rm.id];
        const required = Number(rm.ProductRawMaterial.quantity);

        const possible = Math.floor(available / required);
        if (possible < maxPossible) maxPossible = possible;
      }

      if (maxPossible === Infinity) maxPossible = 0;

      // aplica limite do usuário
      const userLimit = limitsMap.get(product.id);
      const finalQuantity =
        userLimit !== undefined
          ? Math.min(userLimit, maxPossible)
          : maxPossible;

      // desconta do estoque
      for (const rm of product.rawMaterials) {
        const required = Number(rm.ProductRawMaterial.quantity);
        stock[rm.id] -= required * finalQuantity;
      }

      const totalValue = finalQuantity * Number(product.price);
      totalProductionValue += totalValue;

      result.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: finalQuantity,
        totalValue,
      });
    }

    // ordena pelo maior retorno financeiro
    result.sort((a, b) => b.totalValue - a.totalValue);

    return {
      products: result, // result já contém productId, name, price, quantity, totalValue
      totalPotentialValue: Number(totalProductionValue.toFixed(2)), // PADRONIZEI O NOME
      totalRealizedValue: 0, // Como é simulação, não tem realizado, mas evita erro na UI
    };
  }
}

module.exports = new ProductionService();
