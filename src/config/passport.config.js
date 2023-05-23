import passport from "passport";
import local from "passport-local";
import userServices from "../dao/models/registro.model.js";
import { isValidPassword, createHash } from "../utils/utils.js";
import GithubStrategy from "passport-github2";
import * as dotenv from "dotenv";
dotenv.config();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { firstName, lastName, email, age } = req.body;
        try {
          const user = await userServices.findOne({ email: username });
          if (user)
            return done(null, false, { message: "El usuario ya existe" });
          if (!user && email.endsWith("@coder.com")) {
            const newAdminUser = {
              firstName,
              lastName,
              email,
              age,
              password: createHash(password),
              rol: "admin",
            };
            const response = await userServices.create(newAdminUser);
            return done(null, response);
          } else {
            const newUser = {
              firstName,
              lastName,
              email,
              age,
              password: createHash(password),
              rol: "user",
            };
            const response = await userServices.create(newUser);
            return done(null, response);
          }
        } catch (err) {
          return done("error al obtener usuario" + err);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userServices.findOne({ email: username });
          await userServices.findOneAndUpdate(
            { email: username },
            { lastConnection: new Date() }
          );
          if (!user)
            return done(null, false, { message: "Usuario no encontrado" });
          if (!isValidPassword(user, password))
            return done(null, false, { message: "Contraseña incorrecta" });
          return done(null, user);
        } catch (err) {
          return done("error al obtener usuario" + err);
        }
      }
    )
  );

  //GitHub
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user = await userServices.findOne({
            email: profile._json.login + "@github.com",
          });
          await userServices.findOneAndUpdate(
            { email: profile._json.login + "@github.com" },
            { lastConnection: new Date() }
          );
          if (!user) {
            const newUser = {
              firstName: profile._json.name,
              lastName: "Github username: " + " " + profile._json.login,
              email: profile._json.login + "@github.com",
              password: profile._json.id,
            };
            const response = await userServices.create(newUser);
            return done(null, response);
          } else {
            return done(null, user);
          }
        } catch (err) {
          return done("error al obtener usuario" + err);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userServices.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default initializePassport;
