import express from "express";
import allRoutes from "./routes/all.route";
const app = express();
import bodyParser from "body-parser";
import { INTERNAL_LINKS } from "./constant";

require("dotenv").config({ path: ".env" });

// import { morgan } from "morgan";

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
    extended: true,
    limit: "50mb",
    parameterLimit: 1000000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

allRoutes(app);
// app.use(morgan("dev"));

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
const BASE_API_URL = INTERNAL_LINKS.BASE_API_URL;

app.listen(PORT, () => {
  console.log(`server just started at http://${HOST}:${PORT}${BASE_API_URL}`);
});
