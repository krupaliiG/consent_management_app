const jwt = require("jsonwebtoken");
import { userModel } from "../models";
const { ObjectId } = require("mongodb");

const authentication = async (request, response, next) => {
  try {
    let jwtToken = null;
    const authHeader = request.headers["authorization"];

    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
      if (jwtToken === undefined) {
        response.status(401).send({ success: false, message: "Invalid Token" });
      } else {
        const data = jwt.verify(jwtToken, "MY_SECRET_TOKEN");
        if (!data)
          response
            .status(401)
            .send({ success: false, message: "Invalid Credentials!" });

        const res = await userModel.findById(data.id);

        if (!res)
          throw new Error({ success: false, message: "Invalid Credentials!" });

        request["data"] = res;
        next();
      }
    } else {
      response
        .status(400)
        .send({ success: false, message: "Authorization should be there!" });
    }
  } catch (err) {
    response.status(401).send({ success: false, message: err.message });
  }
};

export default authentication;
