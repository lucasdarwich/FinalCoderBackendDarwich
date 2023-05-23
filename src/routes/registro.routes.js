import { Router } from "express";
import passport from "passport";
import {
  autentificarRegistro,
  falloRegistro,
} from "../dao/controllers/registro.controller.js";
import { deleteUser, getUserId } from "../dao/controllers/user.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("registro", {});
});

router.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  autentificarRegistro
);

router.get("/failregister", falloRegistro);

router.get("/user/:uid", getUserId);

router.delete("/:uid", deleteUser);

export default router;
