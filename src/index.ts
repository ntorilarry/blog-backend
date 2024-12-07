import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import { apiV1 } from "./utils/constant";

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");
dotenv.config();

async function start() {
  try {
    const app = express();
    app.use(cors());
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in the environment variables.");
    }

    const mongo = await MongoClient.connect(mongoUrl);

    await mongo.connect();

    app.db = mongo.db();

    // body parser
    app.use(express.json());

    // Routes
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use(`${apiV1}/auth`, require("./routes/auth"));
    app.use(`${apiV1}/users`, require("./routes/users"));
    app.use(`${apiV1}/categories`, require("./routes/categories"));

    // Start server

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
