import express from "express";
import allRoutes from "./routes/all.route";
const app = express();
import bodyParser from "body-parser";
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
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
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

app.listen(3000, () => {
  console.log("server just started at localhost:3000");
});
