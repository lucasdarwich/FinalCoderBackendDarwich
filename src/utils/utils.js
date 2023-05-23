import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { opts } from "../config/options.js";

faker.locale = "es";

const generarMockProductos = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    code: faker.finance.creditCardCVV(),
    category: faker.commerce.productMaterial(),
    stock: faker.random.numeric(4),
    id: faker.database.mongodbObjectId(),
  };
};

const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const generarId = () => {
  const random = Math.random().toString(32).substring(2);
  const fecha = Date.now().toString(32);
  return random + fecha;
};

const generateEmailToken = (email, expireTime) => {
  const token = jwt.sign({ email }, opts.server.tokenKey, {
    expiresIn: expireTime,
  });
  return token;
};

const verifyEmailToken = (token) => {
  try {
    const info = jwt.verify(token, opts.server.tokenKey);
    return info.email;
  } catch (error) {
    return null;
  }
};

export {
  createHash,
  isValidPassword,
  generarId,
  generarMockProductos,
  generateEmailToken,
  verifyEmailToken,
};
