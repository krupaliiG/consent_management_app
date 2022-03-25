const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const { ObjectId } = require("mongodb");

module.exports = async (request, response, next) => {
  try {
    let jwtToken = null;
    const authHeader = request.headers["authorization"];

    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
      if (jwtToken === undefined) {
        response.status(401).send("Invalid Token");
      } else {
        const data = jwt.verify(jwtToken, "MY_SECRET_TOKEN");
        if (!data) response.status(401).send("Invalid Credentials!");

        const res = await User.findById(data.id);

        if (!res) throw new Error("Invalid Credentials!");
        request.data = res;

        next();
      }
    } else {
      response.status(400).send("Authorization should be there!");
    }
  } catch (err) {
    console.log("err::", err);
    response.status(401).send(err.message || err);
  }
};
