// const express = require("express");
import express from "express";
const app = express();
app.use(express.json());

// const dbConfig = require("./config/dbConfig.js");
import dbConfig from "./config/dbConfig.js";
// const mongoose = require("mongoose");
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

require("./routes/consent.route.js")(app);
require("./routes/user.route.js")(app);
// import { userRoute } from "./routes/consent.route.js";
// app.use(userRoute);

app.listen(3000, () => {
  console.log("server just started at localhost:3000");
});
