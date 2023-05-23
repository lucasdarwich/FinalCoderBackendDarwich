export const generateProductErrorInfo = (product) => {
  return `
        Una o mas campos no son validos
        Listado de propiedades requeridas:
        titulo es requerido y debe ser de tipo string. Se recibio ${product.title}
        descripcion es requerido y debe ser de tipo string. Se recibio ${product.description}
        price es requerido y debe ser de tipo number. Se recibio ${product.price}
        code es requerido y debe ser de tipo string. Se recibio ${product.code}
        category es requerido y debe ser de tipo string. Se recibio ${product.category}
        stock es requerido y debe ser de tipo number. Se recibio ${product.stock}
    `;
};

export const generateProductoDeleteErrorInfo = (id) => {
  return `
            El producto con el id ${id} no existe
        `;
};
