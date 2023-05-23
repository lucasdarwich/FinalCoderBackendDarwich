import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import registroModel from "../models/registro.model.js";
import ticketModel from "../models/ticket.model.js";
import { generarId } from "../../utils/utils.js";

class CartManager {
  async getCart() {
    try {
      const cart = await cartModel.find();
      return JSON.stringify(cart, null, "\t");
    } catch (err) {
      throw err;
    }
  }

  async getCartUser(id) {
    try {
      const cart = await cartModel.find({ user: id });
      return JSON.stringify(cart, null, "\t");
    } catch (err) {
      throw err;
    }
  }

  async createCart(cart) {
    try {
      const newCart = new cartModel(cart);
      await newCart.save();
      return cart;
    } catch (err) {
      throw err;
    }
  }

  async addProductToCart(cid, pid, quantity) {
    try {
      const cartId = await cartModel.findById(cid);
      let productId = cartId.products.find(
        (p) => p.product.toString() === pid.toString()
      );
      if (productId) {
        productId.quantity = quantity;
      } else {
        cartId.products.push({ product: pid, quantity: quantity });
      }
      const cartUpdate = await cartModel.updateOne({ _id: cid }, cartId);
      return cartUpdate;
    } catch (err) {
      throw err;
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      const cartId = await cartModel.findById(cid);
      const findproduct = cartId.products;
      const productCart = findproduct.findIndex(
        (p) => p.product.toString() === pid.toString()
      );

      findproduct.splice(productCart, 1);
      const update = { products: findproduct };
      const updateCart = await cartModel.findByIdAndUpdate(cid, update);
      return updateCart;
    } catch (err) {
      throw err;
    }
  }

  async deleteAllProductCart(id) {
    try {
      const deleteProduct = { products: [] };
      const cart = await cartModel.findByIdAndUpdate(id, deleteProduct);
      return cart;
    } catch (err) {
      throw err;
    }
  }

  async createTicket(id) {
    try {
      const cartUser = await this.getCartUser(id);
      const cart = JSON.parse(cartUser);
      const cid = cart[0]._id;

      if (cart[0].products.length === 0) {
        return;
      }

      const productCart = cart[0].products.map((p) => {
        return {
          product: p.product._id,
          quantity: p.quantity,
        };
      });
      let arraySinStock = [];
      let arrayConStock = [];
      let total = 0;
      await Promise.all(
        productCart.map(async (p) => {
          const product = await productModel.findOne({ _id: p.product });
          if (product.stock < p.quantity) {
            arraySinStock.push(product);
            return;
          }
          product.stock = product.stock - p.quantity;
          await product.save();
          product.quantity = p.quantity;
          arrayConStock.push({ ...product, price: product.price * p.quantity });
          await this.removeProductFromCart(cid, p.product);
        })
      );
      if (arraySinStock.length > 0) {
        return { stock: 0 };
      }

      total = arrayConStock.reduce((acc, p) => {
        return acc + p.price;
      }, 0);

      const user = await registroModel.findOne({ _id: id });

      const ticket = new ticketModel({
        code: generarId(),
        amount: total,
        purchaser: user.email,
      });
      await ticket.save();

      return ticket;
    } catch (err) {
      throw err;
    }
  }
}

export default CartManager;
