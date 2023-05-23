import { Schema, model } from "mongoose";

const ticketSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ticketModel = model("Ticket", ticketSchema);

export default ticketModel;
