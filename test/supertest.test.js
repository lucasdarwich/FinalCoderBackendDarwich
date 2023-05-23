import chai from "chai";
import supertest from "supertest";
import { app } from "../src/app.js";

const expect = chai.expect;
const request = supertest(app);

describe("1. Testing del modulo productos", () => {
  it("1-a. Debería devolver un objeto de productos en GET /api/productos", async () => {
    const response = await request.get("/api/products");
    expect(response.body.status).to.be.equal("success");
    expect(response.body.message).to.be.equal("Productos encontrados");
    expect(response.body).to.have.property("products");
    expect(response.body.products).to.have.property("docs");
  });
  it("1-b. Debería devolver un array de productos en GET /api/productos/all", async () => {
    const response = await request.get("/api/products/all");
    expect(response.body).to.be.an("array");
    expect(response.body[0]).to.have.property("_id");
    expect(response.body[0]).to.have.property("title");
    expect(response.body[0]).to.have.property("description");
    expect(response.body[0]).to.have.property("price");
    expect(response.body[0]).to.have.property("code");
    expect(response.body[0]).to.have.property("category");
    expect(response.body[0]).to.have.property("stock");
  });
  it("1-c. Deberia devolver un error ya que se esta intentando crear un producto sin tener credenciales de administrador", async () => {
    const product = {
      title: "Producto de Prueba Test",
      description: "Producto de Prueba Test",
      price: 100,
      code: 1234,
      category: "Producto de Prueba Test",
      stock: 100,
    };
    const response = await request.post("/api/products").send(product);
    expect(response.status).to.be.equal(401);
    expect(response.body.status).to.be.equal("error");
    expect(response.body.message).to.be.equal(
      "No tienes permisos de administrador"
    );
  });
  it("1-d. Deberia devolver un error ya que se esta intentando eliminar un producto sin tener credenciales de administrador", async () => {
    const productId = `642b292f90bc80bf13385d56`; // ID de producto 1 de la base de datos
    const response = await request.delete(`/api/products/${productId}`);
    expect(response.status).to.be.equal(401);
    expect(response.body.status).to.be.equal("error");
    expect(response.body.message).to.be.equal(
      "No tienes permisos de administrador"
    );
  });
});

describe("2. Testing de registro e inicio de sesión de usuario", () => {
  it("2-a. Debería registrar un usuario exitosamente mediante post en ruta /api/registro y luego eliminarlo mediante delete en ruta /api/registro/:id", async () => {
    const mockUser = {
      firstName: "Usuario de Prueba",
      lastName: "Usuario de Prueba",
      email: "userprueba@prueba.com",
      age: 100,
      password: "1234",
      rol: "user",
    };
    //2 pruebas en 1: se crea un usuario, se obtiene su ID y luego se elimina el mismo usuario creado utilizando su ID. Esto lo hacemos aca debido a que estamos utilizando la base de datos original.
    const response = await request.post("/api/registro").send(mockUser);
    const userId = response.body.userID;
    expect(response.body.status).to.be.equal("success");
    expect(response.body.message).to.be.equal("Usuario creado correctamente");
    expect(response.body).to.have.property("userID");
    console.log(`Usuario Creado con Éxito. ID de usuario: ${userId}`);
    const deleteUser = await request.delete(`/api/registro/${userId}`);
    expect(deleteUser.body.status).to.be.equal("success");
    expect(deleteUser.body.message).to.be.equal(
      `Usuario con ID ${userId} eliminado correctamente`
    );
    console.log(
      `Usuario Eliminado con Éxito. ID de usuario Eliminado: ${userId}`
    );
  });
  it("2-b. Deberia fallar al registrar un usuario por datos faltantes", async () => {
    const mockUser = {
      firstName: "Usuario de Prueba",
      lastName: "Usuario de Prueba",
    };
    const response = await request
      .get("/api/registro/failregister")
      .send(mockUser);
    expect(response.body.status).to.be.equal("error");
    expect(response.body.error).to.be.equal("Failed Strategy");
  });
  it("2-c. Inicio de sesión correcto con cuenta admin", async () => {
    const user = {
      email: "admin@admin.com",
      password: "admin",
    };
    const response = await request.post("/api/login/user").send(user);
    expect(response.status).to.be.equal(200);
    expect(response.body).to.have.property("user");
    expect(response.body.user).to.have.property("rol");
    expect(response.body.user.rol).to.be.equal("admin");
  });
  it("2-d. Inicio de sesión correcto con cuenta user", async () => {
    const user = {
      email: "lucasdarwich@gmail.com",
      password: "12341234",
    };
    const response = await request.post("/api/login/user").send(user);
    expect(response.status).to.be.equal(200);
    expect(response.body).to.have.property("user");
    expect(response.body.user.rol).to.be.equal("user");
  });
});

describe("3. Testing del modulo carrito", () => {
  it("3-a. Debería devolver todos los carritos creados en GET /api/carts", async () => {
    const response = await request.get("/api/carts");
    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.an("object");
  });
  it("3-b. Debería devolver un error al tratar de acceder a un carrito inexistente en GET /api/carts/:id", async () => {
    const response = await request.get("/api/carts/1234");
    expect(response.status).to.be.equal(404);
    expect(response.body.message).to.be.equal(
      "No se encontró el ID del carrito especificado"
    );
  });
  it("3-c. Debería devolver un error al tratar de eliminar el Producto 1 (id 642b292f90bc80bf13385d56) de un carrito inexistente en DELETE /api/:cid/products/:pid", async () => {
    const response = await request.delete(
      "/api/carts/cid123123as51da5s1d5as1d/products/642b292f90bc80bf13385d56"
    );
    expect(response.status).to.be.equal(404);
    expect(response.body.message).to.be.equal(
      "No se encontró el ID del carrito especificado"
    );
  });
});
