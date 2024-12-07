const swaggerJSDoc = require("swagger-jsdoc");

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
      url: "http://localhost:8000", // Replace with your base URL
      description: "Development server",
    },
    {
      url: "http://localhost:8000", // Replace with your base URL
      description: "Live server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./build/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
