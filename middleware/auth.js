import { userModel } from "../models";
import { errorLogger, verifyJWT } from "../utils";
const { ObjectId } = require("mongodb");

const authentication = async (request, response, next) => {
  try {
    let jwtToken = null;
    const authHeader = request.headers["authorization"];

    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
      console.log("jwtToken", jwtToken);
      if (jwtToken === undefined) throw new Error("Invalid token!");

      const data = verifyJWT(jwtToken);
      if (!data)
        response
          .status(401)
          .send({ success: false, message: "Invalid Credentials!" });

      const res = await userModel.findById(data.id);

      if (!res)
        throw new Error({ success: false, message: "Invalid Credentials!" });

      request.currentUser = res;
      next();
    } else {
      response
        .status(400)
        .send({ success: false, message: "Authorization should be there!" });
    }
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(401).send({ success: false, message: error.message });
  }
};

export default authentication;
