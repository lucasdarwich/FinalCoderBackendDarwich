export const autentificarRegistro = async (req, res) => {
  res.send({
    status: "success",
    message: "Usuario creado correctamente",
    userID: req.user._id,
  });
};
``;
export const falloRegistro = async (req, res) => {
  console.log("failed Strategy");
  res.send({ status: "error", error: "Failed Strategy" });
};
