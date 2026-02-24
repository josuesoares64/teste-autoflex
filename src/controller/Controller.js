class Controller {
    constructor(entidadeService, entidadeName) {
        this.service = entidadeService;
        this.entidadeName = entidadeName;
    }

    async create(req, res) {
        const data = req.body;
        try {
            const newRegister = await this.service.create(data);
            return res.status(201).json(newRegister);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async catchAll(req, res) {
        try {
            const listAll = await this.service.catchAll();
            return res.status(200).json(listAll);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async pickOne(req, res) {
        const { id } = req.params;
        try {
            const oneRegister = await this.service.getById(id);
            if (!oneRegister) {
                return res.status(404).json({ error: `${this.entidadeName} not found` });
            }
            return res.status(200).json(oneRegister);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateField(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const updated = await this.service.updatePartial(id, data);

      return res.json(updated);
    } catch (error) {
      return res.status(400).json({
        message: 'Erro ao atualizar',
        details: error.message
      });
    }
  }

  async delete(req, res) {
    try {
        const { id } = req.params;

        const result = await this.service.delete(id);

        if (!result) {
            return res.status(404).json({ message: `${this.entidadeName} not found` });
        }

        return res.status(200).json(result);
        
    } catch (error) {
      return res.status(400).json({
        message: 'Erro ao deletar',
        details: error.message
      });
    }
  }
}

module.exports = Controller;