const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Node.js API Documentation",
    version: "1.0.0",
    description: "API documentation for the Node.js application",
  },
  servers: [
    {
      url: "http://localhost:8000", // Replace with your base URL
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
