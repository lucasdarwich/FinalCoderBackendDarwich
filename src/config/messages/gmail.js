import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendRecoveryEmail = async (email, token) => {
  const link = `http://localhost:8080/api/recuperar/reset-password?token=${token}`;

  await transporter.sendMail({
    from: "Tienda Ecommerce",
    to: email,
    subject: "Restablecer contraseña",
    html: `
            <h3>Hola,</h3>
            <p>recibimos tu solicitud para restablecer la constraseña, da click en el siguiente botón</p>
            <a href="${link}">
                <button>Restablecer contraseña</button>
            </a>
        `,
  });
};
