module.exports = (app) => {
  const user = require("../controllers/userController.js");
  const authentication = require("../middleware/auth.js");

  app.post("/users", user.RegisterUser);
  app.post("/login", user.LoginUser);
  app.put("/change-password", authentication, user.ChangePassword);
  app.get("/userdetail", authentication, user.UserDetail);
};
