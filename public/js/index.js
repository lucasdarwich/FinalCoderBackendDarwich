//tabla usuarios modificar rol / eliminar usuario

const getAllUsers = async () => {
  const response = await fetch("/api/users");
  const data = await response.json();
  return data;
};

// renderizar usuarios en la tabla con un boton eliminar y modificar

const paginaUsuarios = async () => {
  try {
    const users = await getAllUsers();
    console.log(users);
    const tabla = document.querySelector(".table");
    const tbody = tabla.querySelector(".tableUsers");

    // Limpiar el contenido actual del tbody
    tbody.innerHTML = "";

    users.forEach((user) => {
      const item = document.createElement("tr");
      item.innerHTML = `
        <td>${user.firstName}</td>
        <td>${user.rol}</td>
        <td><button class="btn btn-danger" id="eliminarUserTabla" data-id="${user._id}">Eliminar</button></td>
        <td><button class="btn btn-warning" id="modificarUserTabla" data-id="${user._id}">Modificar</button></td>
      `;
      tbody.appendChild(item);
    });
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

document.addEventListener("DOMContentLoaded", paginaUsuarios);

//agregar un evento de escucha que al hacer click en el boton  <td><button class="btn btn-danger" id="eliminarUserTabla" data-id="${user._id}">Eliminar</button></td> se debera hacer un fetch con metodo delete a la ruta /api/users/:id para eliminar dicho usuario

document.addEventListener("click", async (e) => {
  if (e.target.id === "eliminarUserTabla") {
    const id = e.target.dataset.id;
    await eliminarUserTabla(id);
  }
});

const eliminarUserTabla = async (id) => {
  const config = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`/api/users/${id}`, config);
    const data = await response.json();
    console.log(data);
    paginaUsuarios();
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
  }
};

//escuchar el boton <td><button class="btn btn-warning" id="modificarUserTabla" data-id="${user._id}">Modificar</button></td> y al hacer hacer el primer click cambiarle el rol a admin y al segundo click cambiarle el rol a user y al tercer click a premium y asi continuamente. Para esto debera hacer un fetch con metodo put a la ruta /api/users/:id y se debe modificar el rol del usuario en la base de datos

document.addEventListener("click", async (e) => {
  if (e.target.id === "modificarUserTabla") {
    const id = e.target.dataset.id;
    await modificarUserTabla(id);
  }
});

// obtener usuario por ID y modificar rol al hacer click en el boton "Modificar Rol" cada click modifica el rol del usuario y lo guarda en la base de datos

const modificarUserTabla = async (id) => {
  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`/api/users/${id}`, config);
    const data = await response.json();
    console.log(data);
    if (data.rol === "user") {
      data.rol = "admin";
    } else if (data.rol === "admin") {
      data.rol = "premium";
    } else if (data.rol === "premium") {
      data.rol = "user";
    }
    const config2 = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response2 = await fetch(`/api/users/${id}`, config2);
    const data2 = await response2.json();
    console.log(data2);
    paginaUsuarios();
  } catch (error) {
    console.error("Error al modificar el usuario:", error);
  }
};

//Registro

const elementExists = (id) => document.getElementById(id) !== null;

elementExists("signup") &&
  document.getElementById("signup").addEventListener("click", function () {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const age = document.getElementById("age").value;

    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      age === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos son Obligatorios!!",
      });
      return;
    }

    const data = { firstName, lastName, email, password, age };

    fetch("/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((data) => {
      const result = data.json();
      console.log(result);
      if (data.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Usuario Creado Con éxito!",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(function () {
          window.location.href = "/api/login";
        }, 2000);
      } else {
        alert("El email ya existe");
      }
    });
  });

//Login

const handleLogin = async (email, password) => {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  try {
    const response = await fetch(`/api/login/user`, config);
    const data = await response.json();
    userId = data.user.id;
    console.log(data);
    return data.message;
  } catch (error) {
    console.log(error);
  }
};

elementExists("send") &&
  document.getElementById("send").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    handleLogin(email, password).then((data) => {
      if (data === "success") {
        window.location.href = "/api/login/products";
      } else {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Usuario o contraseña incorrecta!",
        });
      }
    });
  });

elementExists("logout") &&
  document
    .getElementById("logout")
    .addEventListener("click", async function () {
      try {
        const response = await fetch("/api/login/logout");
        const data = await response.json();
        console.log(data);
        if (data.message === "LogoutOK") {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Gracias por tu visita!",
            showConfirmButton: false,
            timer: 2000,
          });
          setTimeout(function () {
            window.location.href = "/api/home";
          }, 2500);
        } else {
          alert("logout failed");
        }
      } catch (error) {
        console.log(error);
      }
    });

//Productos

let containerCards = document.getElementById("containerCards");
let containerCart = document.getElementById("containerCart");
let btnAnterior = document.getElementById("btnAnterior");
let btnSiguiente = document.getElementById("btnSiguiente");
let linkCarrito = document.getElementById("linkCarrito");
let tituloCarrito = document.getElementById("tituloCarrito");
let pag = document.getElementById("pag");
let admin = document.getElementById("admin");
let pagina = 1;
let limite;

const paginaProductos = () => {
  const getProduct = async (limit = 6, page = 1) => {
    const product = await fetch(`/api/products/?limit=${limit}&page=${page}`);
    const result = await product.json();
    return result;
  };

  const renderProducts = async () => {
    const products = await getProduct();

    if (!products.products.hasPrevPage) {
      btnAnterior.disabled = true;
    }
    if (products.products.hasNextPage) {
      btnSiguiente.disabled = false;
    }
    if (!products.products.hasNextPage) {
      btnSiguiente.disabled = true;
    }
    if (products.products.hasPrevPage) {
      btnAnterior.disabled = false;
    }

    render(products);
  };

  renderProducts();

  const render = (products) => {
    containerCards.innerHTML = "";
    products.products.docs.map((prod, index) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.innerHTML = `<div class="card" style="width: 15rem; margin: 5px">
                <div class="card-body">
                <h5 class="card-title">${prod.title}</h5>
                <p class="card-text"> ${prod.description}</p>
                <p class="card-text">Precio: $${prod.price}</p>
                <p class="card-text">Categoria: ${prod.category}</p>
                <p class="card-text">Stock: ${prod.stock}</p>
                <label for="cantidad">Cantidad:</label>
                <input type=number class="card-text" min="1" value="1" id="${index}"/>
                </div>
                <button class="btn btn-primary mx-auto mb-1" id=${prod._id}>Agregar al Carrito</button>
                </div>`;
      containerCards.appendChild(item);
      const cantidad = document.getElementById(index);
      cantidad.addEventListener("change", (e) => {
        recibirCantidad(e.target.value);
      });

      let quantity;
      const recibirCantidad = (cant) => {
        quantity = cant;
      };
      const btnAgregar = document.getElementById(prod._id);
      btnAgregar.addEventListener("click", () => addCart(prod._id, quantity));
    });
  };

  const siguiente = async () => {
    pagina++;
    pag.innerHTML = pagina;
    const products = await getProduct(6, pagina);
    if (!products.products.hasNextPage) {
      btnSiguiente.disabled = true;
    }
    if (products.products.hasPrevPage) {
      btnAnterior.disabled = false;
    }

    render(products);
  };
  const anterior = async () => {
    pagina--;
    pag.innerHTML = pagina;
    const products = await getProduct(6, pagina);

    if (!products.products.hasPrevPage) {
      btnAnterior.disabled = true;
    }
    if (products.products.hasNextPage) {
      btnSiguiente.disabled = false;
    }

    render(products);
  };

  btnSiguiente.addEventListener("click", siguiente);
  btnAnterior.addEventListener("click", anterior);
};
elementExists("pag") && paginaProductos();

//Carrito

const getUser = async () => {
  const user = await fetch(`/api/users/user`);
  const data = await user.json();
  return data;
};

const getCart = async () => {
  const user = await getUser();
  const userId = user._id;
  const getCartUser = await fetch(`/api/carts/${userId}`);
  const data = await getCartUser.json();
  return data;
};

const addCart = async (pid, quantity) => {
  console.log(quantity);
  const user = await getUser();
  const cartId = user.cart;
  try {
    const addCartProduct = await fetch(`/api/carts/${cartId}/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: quantity,
      }),
    });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto Agregado al Carrito",
      showConfirmButton: false,
      timer: 2000,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteCart = async (pid) => {
  const carritoUser = await getUser();
  const cartId = carritoUser.cart;
  try {
    const deleteCartProduct = await fetch(
      `/api/carts/${cartId}/products/${pid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto eliminado del carrito",
      showConfirmButton: false,
      timer: 2000,
    });
    renderCart();
  } catch (err) {
    console.log(err);
  }
};

const renderCart = async () => {
  const productos = await getCart();
  containerCart.innerHTML = "";
  await productos[0].products.map((prod) => {
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `<div class="card" style="width: 15rem; margin: 5px">
        <div class="card-body">
            <h5 class="card-title">${prod.product.title}</h5>
            <p class="card-text"> ${prod.product.description}</p>
            <p class="card-text">PRECIO: $${prod.product.price}</p>
            <p class="card-text">Cantidad: ${prod.quantity}</p>
            <button class="btn btn-danger mx-auto mb-1" id=${prod.product._id}>Eliminar del Carrito</button>
         </div>
     </div>`;

    containerCart.appendChild(item);

    const btnEliminar = document.getElementById(prod.product._id);
    btnEliminar.addEventListener("click", () => deleteCart(prod.product._id));
  });

  const ticket = document.getElementById("ticket");

  ticket.addEventListener("click", async () => {
    const carritoUser = await getUser();
    const userId = carritoUser._id;
    console.log(userId);
    const response = await fetch(`/api/carts/${userId}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    if (data.stock === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No hay stock de esos Productos",
      });
      return;
    }

    renderCart();
    Swal.fire({
      icon: "success",
      title: "Ticket generado",
      html: `<p><b>Codigo de ticket:</b> ${data.code}</p>
            <p><b>Precio total de la Compra:</b> $${data.amount}</p>
            <p><b>Usuario:</b> ${data.purchaser}</p>
            <p><b>Fecha de compra:</b> ${data.createdAt}</p> `,
    });
  });
};
elementExists("containerCart") && renderCart();

//Admin

const paginaAdministrador = () => {
  let paginaAdm = document.getElementById("pagina");

  const getProduct = async (limit = 6, page = 1) => {
    console.log(limit, page);
    const product = await fetch(`/api/products/?limit=${limit}&page=${page}`);
    const result = await product.json();
    return result;
  };

  const getAllProducts = async () => {
    const getAllProducts = await fetch(`/api/products/all`);
    const result = await getAllProducts.json();
    return result;
  };

  const renderProductsAdmin = async () => {
    const products = await getProduct();
    if (!products.products.hasPrevPage) {
      btnAnterior.disabled = true;
    }
    if (products.products.hasNextPage) {
      btnSiguiente.disabled = false;
    }
    if (!products.products.hasNextPage) {
      btnSiguiente.disabled = true;
    }
    if (products.products.hasPrevPage) {
      btnAnterior.disabled = false;
    }

    render(products);
  };

  renderProductsAdmin();

  const render = async (products) => {
    console.log(products);
    containerCards.innerHTML = "";
    products.products.docs.map((prod, index) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.innerHTML = `<div class="card" style="width: 15rem; margin: 5px">
                <div class="card-body">
                <h5 class="card-title">${prod.title}</h5>
                <p class="card-text"> ${prod.description}</p>
                <p class="card-text">PRECIO: $${prod.price}</p>
                <p class="card-text">CATEGORIA: ${prod.category}</p>
                <p class="card-text">Codigo: ${prod.code}</p>
                <p class="card-text">Stock: ${prod.stock}</p>
                </div>
            
                </div>`;
      containerCards.appendChild(item);
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const products = await getAllProducts();

    const prod = {
      title: document.getElementById("nombre").value,
      description: document.getElementById("descripcion").value,
      price: document.getElementById("precio").value,
      category: document.getElementById("categoria").value,
      code: document.getElementById("codigo").value,
    };

    const code = products.find(
      (prod) => prod.code == document.getElementById("codigo").value
    );

    if (code) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El código ya existe!",
      });
      return;
    }
    if (
      !prod.title ||
      !prod.description ||
      !prod.price ||
      !prod.category ||
      !prod.code
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos son obligatorios!!",
      });
      return;
    }

    console.log(prod);
    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prod),
    });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto Agregado!!",
      showConfirmButton: false,
      timer: 2000,
    });
    renderProductsAdmin();
    pagina = 1;
    paginaAdm.innerHTML = pagina;
    formulario.reset();
  };

  const deleteProduct = async (e) => {
    e.preventDefault();
    const products = await getAllProducts();
    const deleteProduct = document.getElementById("codigoEliminar").value;
    const id = products.find((prod) => prod.code == deleteProduct);

    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El código no existe!",
      });
      return;
    }

    await fetch(`/api/products/${id._id}`, {
      method: "DELETE",
    });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto Eliminado!!",
      showConfirmButton: false,
      timer: 2000,
    });
    renderProductsAdmin();
    pagina = 1;
    paginaAdm.innerHTML = pagina;
    const formulario = document.getElementById("form");
    formulario.reset();
  };

  const formulario = document.getElementById("form");
  document.getElementById("btnAdd").addEventListener("click", addProduct);
  document
    .getElementById("btnEliminar")
    .addEventListener("click", deleteProduct);

  const siguiente = async () => {
    pagina++;
    paginaAdm.innerHTML = pagina;
    const products = await getProduct(6, pagina);
    if (!products.products.hasNextPage) {
      btnSiguiente.disabled = true;
    }
    if (products.products.hasPrevPage) {
      btnAnterior.disabled = false;
    }

    render(products);
  };

  const anterior = async () => {
    pagina--;
    paginaAdm.innerHTML = pagina;
    const products = await getProduct(6, pagina);

    if (!products.products.hasPrevPage) {
      btnAnterior.disabled = true;
    }
    if (products.products.hasNextPage) {
      btnSiguiente.disabled = false;
    }

    render(products);
  };

  let btnAnterior = document.getElementById("btnAnt");
  let btnSiguiente = document.getElementById("btnSig");

  btnSiguiente.addEventListener("click", siguiente);
  btnAnterior.addEventListener("click", anterior);
};

elementExists("btnAdd") && paginaAdministrador();

//Chat

const socket = io();

//Elementos del Dom
let message = document.getElementById("message");
let user = document.getElementById("userName");
let btn = document.getElementById("send");
let output = document.getElementById("output");
let actions = document.getElementById("actions");

const getMessage = async () => {
  const response = await fetch("/api/chat/messages");
  const data = await response.json();
  const message = data.map(
    (msj) =>
      (output.innerHTML += `<p>
        <strong>${msj.user}</strong>: ${msj.message} 
     </p>`)
  );
};
getMessage();

btn.addEventListener("click", () => {
  socket.emit("mensaje", {
    message: message.value,
    user: user.value,
  });
  message.value = "";
});

message.addEventListener("keypress", () => {
  socket.emit("escribiendo", user.value);
});

socket.on("mensajeServidor", (data) => {
  actions.innerHTML = "";
  output.innerHTML += `<p>
       <strong>${data.user}</strong>: ${data.message} 
    </p>`;
});

socket.on("escribiendo", (data) => {
  actions.innerHTML = `<p><em>${data} esta escribiendo...</em></p>`;
});
