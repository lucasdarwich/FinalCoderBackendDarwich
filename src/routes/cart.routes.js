import { Router } from "express";
import {
  actualizarProductoCarrito,
  crearCarrito,
  createTicket,
  eliminarProductoCarrito,
  eliminarTodosProductosCarrito,
  obtenerCarrito,
  obtenerCarritoUser,
} from "../dao/controllers/cart.controller.js";
import { isUsuarioRole, checkRoles } from "../middlewares/auth.roles.js";

const router = Router();

router.get("/", obtenerCarrito);

router.get("/:id", obtenerCarritoUser);

router.post("/", crearCarrito);

router.put("/:cid/products/:pid", actualizarProductoCarrito);

router.delete("/:cid/products/:pid", eliminarProductoCarrito);

router.delete("/:cid", eliminarTodosProductosCarrito);

router.post("/:uid/purchase", createTicket);

export default router;
