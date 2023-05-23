import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";
import colors from "colors";

dotenv.config();

const DB_URL = `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASS_MONGO}@ecommercecluster.znfvobx.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority`;

const conexionDB = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(DB_URL, (err) => {
    if (err) {
      logger.error(colors.red("No se puede conectar a la base de datos"));
    } else {
      logger.info(colors.green("Mongoose conectado con Exito"));
    }
  });
};

export default conexionDB;
