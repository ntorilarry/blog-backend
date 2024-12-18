const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Blog API Documentation",
    version: "1.0.0",
    description: "API documentation for the Blog application",
    contact: {
      name: "Larry Ntori",
      email: "lntori@gmail.com",
    },
  },
  servers: [
    {
      url: "https://blog-backend-snkr.onrender.com/api/v1",
      description: "Live server",
    },
    {
      url: "http://localhost:8080/api/v1", // Replace with your base URL
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
