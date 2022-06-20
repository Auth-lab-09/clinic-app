'use strict';

class DataCollection {
  constructor(model) {
    this.model = model;
  }

  async get(data_id) {
    try {
      if (data_id) {
        let record = await this.model.findOne({ where: { id: data_id } });
        return record;
      } else {
        let record = await this.model.findAll();
        return record;
      }
    } catch (e) {
      console.error('error in reading record in model ', this.model);
    }
  }

  async create(obj) {
    try {
      let newRecord = await this.model.create(obj);
      return newRecord;
    } catch (err) {
      console.error('error in creating a new record in model ', this.model);
    }
  }

  async update(id, obj) {
    let findElement = await this.model.findOne({ where: { id: id } });
    if (findElement) {
      try {
        let updated = await findElement.update(obj);
        return updated;
      } catch (e) {
        console.error('error in updating record in model ', this.model);
      }
    } else {
      return { message: 'No ID was found' };
    }
  }

  async delete(data_id) {
    if (!data_id) {
      throw new Error('no id provided for model ', this.model);
    }
    try {
      let deleted = await this.model.destroy({ where: { id: data_id } });
      return deleted;
    } catch (e) {
      console.error('error in deleting record in model ', this.model);
    }
  }
}

module.exports = DataCollection;
