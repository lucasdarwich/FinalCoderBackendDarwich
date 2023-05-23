import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "Documentación de API - Desafio 10 CoderHouse",
      version: "1.0.0",
      description: "Definición de endpoits del curso de backend de Coderhouse",
      contact: {
        name: "Lucas Darwich",
        email: "lucasdarwich@gmail.com",
      },
    },
  },
  apis: ["src/docs/**/*.yaml"],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
