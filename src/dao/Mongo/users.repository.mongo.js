//create a user repository mongo file using the registro model located in src/models/registo.model.js with ES6
import registroModel from "../../models/registro.model.js";

export default class UserManager {
  constructor() {
    this.model = registroModel;
  }

  async getAll() {
    try {
      return await this.model.find();
    } catch (error) {
      return error;
    }
  }

  async getById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      return error;
    }
  }
  async add(registro) {
    try {
      return await this.model.create(registro);
    } catch (error) {
      return error;
    }
  }

  async update(id, registro) {
    try {
      return await this.model.findByIdAndUpdate(id, registro, {
        new: true,
      });
    } catch (error) {
      return error;
    }
  }

  async delete(id) {
    try {
      await this.model.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  //obtener todos los usuarios, devolviendo solamente los datos principales de cada usuario (firstName, email y rol)
  async getAllUsers() {
    try {
      return await this.model.find().select({ firstName: 1, email: 1, rol: 1 });
    } catch (error) {
      return false;
    }
  }

  //elimintar todos los usuarios que no hayan tenido conexión en los últimos 2 días. Deberá enviarse un correo indicando al usuario que su cuenta ha sido eliminada por inactividad
  async deleteInactiveUsers() {
    try {
      return await this.model.deleteMany({
        lastConnection: { $lte: new Date(Date.now() - 172800000) },
      });
    } catch (error) {
      return error;
    }
  }
}
