import mongoose from "mongoose";
import { cartModel } from "./cart.model.js";

const registroCollection = "Registro";

const registroSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: Number,
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",
  },
  lastConnection: {
    type: Date,
    default: null,
  },
});

registroSchema.pre("save", async function (next) {
  if (this.cart) {
    return next();
  }
  try {
    const cart = new cartModel({ user: this._id });
    await cart.save();
    this.cart = cart._id;
    next();
  } catch (error) {
    next(error);
  }
});

const registroModel = mongoose.model(registroCollection, registroSchema);

export default registroModel;
