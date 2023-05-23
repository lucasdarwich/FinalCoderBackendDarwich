import { Router } from "express";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProducto,
  obtenerTodosLosProductos,
} from "../dao/controllers/productos.controller.js";
import { checkRoles } from "../middlewares/auth.roles.js";

const router = Router();

router.get("/", obtenerProducto);

router.get("/all", obtenerTodosLosProductos);

router.post("/", checkRoles(["premium", "admin"]), crearProducto);

router.put("/:id", checkRoles(["premium", "admin"]), actualizarProducto);

router.delete("/:id", checkRoles(["premium", "admin"]), eliminarProducto);

export default router;
