import registroModel from "../models/registro.model.js";
import nodemailer from "nodemailer";
import { opts } from "../../config/options.js";

// obtener todos los usuarios

export const getAllUsers = async (req, res) => {
  try {
    const users = await registroModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//agregar usuario nuevo

export const addUser = async (req, res) => {
  try {
    const user = await registroModel.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obtener los datos del usuario logeado

export const getLoggedUser = async (req, res) => {
  try {
    const user = await registroModel.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//obtener usuario por id

export const getUserById = async (req, res) => {
  try {
    const user = await registroModel.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario por ID

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await registroModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Eliminar un usuario por ID

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await registroModel.findByIdAndDelete(userId);
    if (result) {
      res.json({
        status: "success",
        message: `Usuario con ID ${userId} eliminado correctamente`,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obtener todos los usuarios, devolviendo solamente los datos principales de cada usuario (firstName, email y rol)

export const getAllUsersMainData = async (req, res) => {
  try {
    const users = await registroModel.find(
      {},
      { firstName: 1, email: 1, rol: 1 }
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//elimintar y enviar un correo con nodemailer a todos los usuarios que no hayan tenido conexión en los últimos 2 días. Deberá enviarse un correo indicando al usuario que su cuenta ha sido eliminada por inactividad

export const deleteInactiveUsers = async (res) => {
  try {
    const users = await registroModel.find();
    const today = new Date();
    const twoDaysAgo = new Date(today.setDate(today.getDate() - 2));
    const inactiveUsers = users.filter(
      (user) => user.lastConnection < twoDaysAgo
    );
    if (inactiveUsers.length > 0) {
      inactiveUsers.forEach(async (user) => {
        await registroModel.findByIdAndDelete(user._id);
        const transporter = nodemailer.createTransport({
          service: "gmail",
          port: 587,
          secure: false,
          auth: {
            user: opts.gmail.adminGmail,
            pass: opts.gmail.adminPass,
          },
        });
        const mailOptions = {
          from: opts.gmail.adminGmail,
          to: user.email,
          subject: "IMPORTANTE: Cuenta eliminada por inactividad",
          text: `Hola ${user.firstName}, tu cuenta ha sido eliminada por inactividad. Si deseas volver a registrarte, puedes hacerlo en: http://localhost:8080/api/home/registro`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          }
        });
      });
      return res.status(200).json({
        status: "success",
        message: "Usuarios inactivos eliminados correctamente",
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "No hay usuarios inactivos",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const modifyUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    //Verificamos si el usuario existe en la db
    const user = await registroModel.find({ _id: userId });
    //obtenemos el actual rol del usuario
    const userRole = user.rol;
    //validamos el rol actual y cambiamos el rol del usuario
    if (userRole === "usuario") {
      user.rol = PremiumRole;
    } else if (userRole === PremiumRole) {
      user.rol = "usuario";
    } else {
      return res.json({
        status: "error",
        message: "No es posible cambiar el rol de un administrador",
      });
    }
    await registroModel.findByIdAndUpdate(userId, user);
    res.json({
      status: "success",
      message: `nuevo rol del usuario: ${user.rol}`,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

//devolver id del usuario
export const getUserId = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await registroModel.find({ _id: userId });
    res.json({ status: "success", message: userId });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};
