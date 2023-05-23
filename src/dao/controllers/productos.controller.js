import ProductManger from "../Mongo/product.repository.Mongo.js";

const productManger = new ProductManger();

export const obtenerProducto = async (req, res) => {
  const { limit, page, sort, query } = req.query;
  let queryList = { limit, page, sort, query };

  try {
    const products = await productManger.getProduct(queryList);
    res.send({ status: "success", message: "Productos encontrados", products });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const obtenerTodosLosProductos = async (req, res) => {
  try {
    const products = await productManger.getAllProducts();
    res.send(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const crearProducto = async (req, res) => {
  const newProduct = {
    ...req.body,
  };
  try {
    const response = await productManger.createProduct(newProduct);
    res.send(response);
  } catch (err) {
    throw err;
  }
};

export const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  try {
    const response = await productManger.updateProduct(id, product);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await productManger.deleteProduct(id);
    res.send({
      message: "Product deleted successfully",
      id: id,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
