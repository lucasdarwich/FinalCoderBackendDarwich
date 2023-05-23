import { productModel } from "../models/product.model.js";
import { CustomError } from "../../services/error/customError.js";
import { EError } from "../../enums/EError.js";
import { generateProductoDeleteErrorInfo } from "../../services/error/productoErrorInfo.js";

class ProductManger {
  async getAllProducts() {
    try {
      const products = await productModel.find();
      return products;
    } catch (err) {
      throw err;
    }
  }

  async getProduct(queryList) {
    const { query, sort } = queryList;

    try {
      if (queryList) {
        const productsParams = await productModel.paginate(
          query ? { category: query } : {},
          { limit: queryList.limit || 10, page: queryList.page || 1 }
        );
        if (sort === "asc") {
          const productsParamas = await productModel.aggregate([
            {
              $sort: { price: 1 },
            },
          ]);
          return productsParamas;
        }
        if (sort === "desc") {
          const productsParamas = await productModel.aggregate([
            {
              $sort: { price: -1 },
            },
          ]);
          return productsParamas;
        }
        return productsParams;
      }
    } catch (err) {
      throw err;
    }
  }

  async createProduct(product) {
    try {
      const newProduct = new productModel(product);
      await newProduct.save();
      return product;
    } catch (err) {
      throw err;
    }
  }

  async updateProduct(id, product) {
    try {
      const update = await productModel.findByIdAndUpdate(id, product);
      return update;
    } catch (err) {
      throw err;
    }
  }

  async deleteProduct(id) {
    try {
      const deleteProd = await productModel.findByIdAndDelete(id);
      return deleteProd;
    } catch (err) {
      return CustomError.createError({
        message: `Error al Eliminar el Producto ${generateProductoDeleteErrorInfo(
          id
        )}`,
        errorCode: EError.PRODUCT_NOT_DELETED,
      });
    }
  }
}

export default ProductManger;
