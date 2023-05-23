import { Router } from "express";
import passport from "passport";
import {
  getAllUsers,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsersMainData,
  deleteInactiveUsers,
  getLoggedUser,
} from "../dao/controllers/user.controller.js";

const router = Router();

// Crear un usuario
router.post("/", addUser);

// Obtener todos los usuarios
router.get("/", getAllUsers);

//obtener usuario

router.get("/user", getLoggedUser);

// Obtener todos los usuarios con datos principales
router.get("/datosprincipales", getAllUsersMainData);

// Eliminar usuarios inactivos
router.delete("/inactive-users", (req, res) => {
  deleteInactiveUsers(res);
});

// Obtener un usuario por ID
router.get("/:id", getUserById);

// Actualizar un usuario por ID
router.put("/:id", updateUser);

// Eliminar un usuario por ID
router.delete("/:id", deleteUser);

export default router;
