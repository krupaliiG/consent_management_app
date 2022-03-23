module.exports = (app) => {

    const user = require('../controllers/userController.js');

    app.post('/users', user.RegisterUser);
    app.post('/login', user.LoginUser);
    app.put('/change-password/:id',  user.ChangePassword);
    
}