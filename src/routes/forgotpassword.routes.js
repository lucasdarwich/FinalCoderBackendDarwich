import express from "express";

import {
  forgotPass,
  resetPass,
} from "../dao/controllers/forgot.password.controller.js";

const router = express.Router();

router.get("/recovery-password", (req, res) => {
  res.render("forgotPassword");
});

router.get("/reset-password", (req, res) => {
  const token = req.query.token;
  console.log(token);
  res.render("resetPassword", { token });
});

router.post("/forgot-password", forgotPass);

router.post("/resetPassword", resetPass);

export default router;
