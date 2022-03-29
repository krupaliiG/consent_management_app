// const validationSchema = require("../joiSchema/validationSchema");
import validationSchema from "../joiSchema/validationSchema";

module.exports = (app) => {
  const user = require("../controllers/userController.js");
  const authentication = require("../middleware/auth.js");

  app.post("/users", validationSchema.registerUserSchema, user.RegisterUser);
  app.post("/login", validationSchema.loginUserSchema, user.LoginUser);
  app.post("/change-password", authentication, user.ChangePassword);
  app.get("/users", authentication, user.Users);
  app.get("/userdetail", authentication, user.UserDetail);
};
