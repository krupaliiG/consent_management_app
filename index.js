require("dotenv").config({ path: ".env" });
import express from "express";
// const fileUpload = require("express-fileupload");
import allRoutes from "./routes/all.route";
const app = express();
import bodyParser from "body-parser";
import { INTERNAL_LINKS } from "./constant";
import morgan from "morgan";
// app.use(fileUpload());

import dbConfig from "./config/dbConfig.js";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log("Could not connect to the database. Exiting now...", error);
    process.exit(1);
  });

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "50mb",
    parameterLimit: 1000000,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("dev"));

allRoutes(app);

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT;
const BASE_API_URL = INTERNAL_LINKS.BASE_API_URL;

app.listen(PORT, () => {
  console.log(`server just started at http://${HOST}:${PORT}${BASE_API_URL}`);
});
