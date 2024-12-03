import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

const express = require("express");
const body = require("body-parser");
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

    app.use(
      body.json({
        limit: "500kb",
      })
    );

    // Routes

    app.use("/auth", require("./routes/auth"));

    // Start server

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
