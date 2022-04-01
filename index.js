import express from "express";
const app = express();
app.use(express.json());

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

import { INTERNAL_LINKS } from "./constant";
import { userRoute, consentRoute } from "./routes";

app.use(INTERNAL_LINKS.USER.BASE_URL, userRoute);
app.use(INTERNAL_LINKS.CONSENT.BASE_URL, consentRoute);

app.listen(3000, () => {
  console.log("server just started at localhost:3000");
});
