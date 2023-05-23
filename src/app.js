import express from "express";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import axios from "axios";
import colors from "colors";
import { logger } from "./utils/logger.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import viewsRouter from "./routes/views.routes.js";
import registroRouter from "./routes/registro.routes.js";
import loginRouter from "./routes/login.routes.js";
import productsRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import githubRoutes from "./routes/github.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import conexionDB from "./config/db.mongoose.js";
import mockingRoutes from "./routes/mocking.routes.js";
import userRoutes from "./routes/users.routes.js";
import { errorHandler } from "./middlewares/errorHandlers.js";
import { opts } from "./config/options.js";
import loggerRoutes from "./routes/logger.routes.js";
import forgotpasswordRoutes from "./routes/forgotpassword.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./config/docConfig.js";

const app = express();
const PORT = opts.server.port;
const DB_URL = opts.mongoDB.url;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.static("public"));

// logger middleware

app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

const server = app.listen(PORT, () => {
  logger.info(colors.green(`Servidor OK en puerto ${PORT}`));
  /*   console.log(`Servidor OK en puerto ${PORT}`);
   */
});

server.on("error", (error) => {
  logger.error(colors.red("Error en el servidor", error));
  /*   console.log("Error en el servidor", error);
   */
});

app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DB_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10000,
    }),
    secret: "xxxxxx",
    resave: true,
    saveUninitialized: true,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

conexionDB();

const socketIo = new Server(server);

socketIo.on("connection", (socket) => {
  logger.info(colors.green("Nuevo Usuario conectado"));

  socket.on("mensaje", (data) => {
    socketIo.emit("mensajeServidor", data);
    axios.post("http://localhost:8080/api/chat", data);
  });

  socket.on("escribiendo", (data) => {
    socket.broadcast.emit("escribiendo", data);
  });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/home", viewsRouter);
app.use("/api/registro", registroRouter);
app.use("/api/login", loginRouter);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/sessions", githubRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/mockingproducts", mockingRoutes);
app.use("/api/loggerTest", loggerRoutes);
app.use("/api/recuperar", forgotpasswordRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

export { app };
