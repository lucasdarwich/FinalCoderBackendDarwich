import registroModel from "../models/registro.model.js";
import {
  generateEmailToken,
  verifyEmailToken,
  isValidPassword,
  createHash,
} from "../../utils/utils.js";
import { sendRecoveryEmail } from "../../config/messages/gmail.js";

export const forgotPass = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await registroModel.findOne({ email: email });
    if (!user) {
      return res.send(
        `<p>el usuario no existe, <a href="/signup">Crea una cuenta</a></p>`
      );
    }
    const token = generateEmailToken(user.email, 3600);
    await sendRecoveryEmail(email, token);
    res.send(
      "<p>Fue enviado el correo con las instrucciones para restablecer la contraseña</p>"
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const resetPass = async (req, res) => {
  try {
    const token = req.query.token;
    const { email, newPassword } = req.body;
    //validar que el token sea valido.
    const validEmail = verifyEmailToken(token);
    if (!validEmail) {
      return res.send(
        `El enlace caduco o no es valido, <a href="/api/recuperar/recovery-password">intentar de nuevo</a>`
      );
    }
    //validamos que el usuario exista en la db
    const user = await registroModel.findOne({ email: email }).lean();
    if (!user) {
      return res.send(
        `<p>el usuario no existe, <a href="/api/login">Crea una cuenta</a></p>`
      );
    }
    if (isValidPassword(user, newPassword)) {
      //si las contrasenas son iguales
      return res.render("resetPassword", {
        error: "no puedes usar la misma contraseña",
        token,
      });
    }
    //procedemos a actualizar la contrasena del usuario en la db
    const newUser = {
      ...user,
      password: createHash(newPassword),
    };
    await registroModel.updateOne({ _id: user._id }, newUser);
    res.redirect("/api/login");
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};
