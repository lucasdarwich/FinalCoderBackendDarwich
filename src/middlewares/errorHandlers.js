import { EError } from "../enums/EError.js";

export const errorHandler = (err, req, res, next) => {
  console.log(err.code);
  switch (err.code) {
    case EError.PRODUCT_NOT_CREATED:
      res.send({ status: "error", error: err.cause });
      break;
    case EError.PRODUCT_NOT_DELETED:
      res.json({ status: "error", error: err.cause });
      break;
    default:
      res.json({ status: "error", error: "error desconocido" });
      break;
  }
};
