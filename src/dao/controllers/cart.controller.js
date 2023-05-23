import CartManager from "../Mongo/cart.repository.mongo.js";

const cartManager = new CartManager();

export const obtenerCarrito = async (req, res) => {
  try {
    const cart = await cartManager.getCart();
    res.send(cart);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const obtenerCarritoUser = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await cartManager.getCartUser(id);
    res.send(cart);
  } catch (err) {
    res
      .status(404)
      .send({ message: "No se encontró el ID del carrito especificado" });
  }
};

export const crearCarrito = async (req, res) => {
  try {
    const response = await cartManager.createCart([]);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const actualizarProductoCarrito = async (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;
  let { quantity } = req.body;
  try {
    const response = await cartManager.addProductToCart(cid, pid, quantity);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const eliminarProductoCarrito = async (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;

  try {
    const response = await cartManager.removeProductFromCart(cid, pid);
    res.send({
      message: "Producto eliminado con éxito!",
      id: pid,
    });
  } catch (err) {
    res
      .status(404)
      .send({ message: "No se encontró el ID del carrito especificado" });
  }
};

export const eliminarTodosProductosCarrito = async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartManager.deleteAllProductCart(cid);
    res.send({
      message: "Carrito eliminado con éxito!",
      id: cid,
    });
  } catch (err) {
    req.status(500).send(err.message);
  }
};

export const createTicket = async (req, res) => {
  const { uid } = req.params;
  try {
    const response = await cartManager.createTicket(uid);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
