import * as dotenv from "dotenv";
dotenv.config();

const DB_USER = process.env.USER_MONGO;
const DB_PASS = process.env.PASS_MONGO;
const DB_NAME = process.env.DB_MONGO;
const PORT = process.env.PORT || 8080;
const SECRET_SESSION = process.env.SECRET_SESSION;
const NODE_ENV = process.env.ENVIRONMENT;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const ADMIN_GMAIL = process.env.GMAIL_USER;
const ADMIN_GMAIL_PASS = process.env.GMAIL_PASS;

export const opts = {
  mongoDB: {
    url: `mongodb+srv://${DB_USER}:${DB_PASS}@ecommercecluster.znfvobx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  },
  server: {
    port: PORT,
    secretSession: SECRET_SESSION,
    tokenKey: TOKEN_SECRET,
  },
  logger: {
    nodeEnv: NODE_ENV,
  },
  gmail: {
    adminGmail: ADMIN_GMAIL,
    adminPass: ADMIN_GMAIL_PASS,
  },
};
