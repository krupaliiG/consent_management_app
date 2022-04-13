const jwt = require("jsonwebtoken");

const verifyJWT = (token) => {
  const verifyToken = jwt.verify(token, "MY_SECRET_TOKEN");
  return verifyToken;
};

export default verifyJWT;
