const dataSource = require('../models')

class Services {
    constructor(modelName) {
        this.model = dataSource[modelName];
    }

    async create(data) {
        return await this.model.create(data);
    }

    async catchAll(where = {}) {
        return await this.model.findAll({ where: { ...where } });
    }

    async getById(id) {
        return await this.model.findOne({
            where: { id}
        })
    }

    async updatePartial(id, data) {
    const record = await this.model.findByPk(id);

    if (!record) {
      throw new Error('Registro não encontrado');
    }

    await record.update(data);

    return record;
  }

  async delete(id) {
    const record = await this.model.findByPk(id);

    if (!record) return { message: 'Registro não encontrado' };

    await record.destroy();

    return { message: 'Registro deletado com sucesso' };
}
}

module.exports = Services;