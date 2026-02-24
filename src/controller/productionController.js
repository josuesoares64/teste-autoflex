const productionService = require('../services/ServicesProduction');

class ProductionController {
  getProduction = async (req, res) => {
    try {
      const result = await productionService.calculateProduction();
      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        error: 'Error calculating production',
        details: error.message,
      });
    }
  };

  createOutput = async (req, res) => {
  try {
    const result = await productionService.registerOutput(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

  async calculatePlan(req, res) {
    try {
      const { limits } = req.body;

      const result = await productionService.calculateWithLimits(limits);

      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Erro ao calcular plano de produção',
      });
    }
  }
}

module.exports = new ProductionController();