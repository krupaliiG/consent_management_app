const express = require("express")
const app = express();
app.use(express.json());



const dbConfig = require('./config/dbConfig.js');
const mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;


mongoose.connect(dbConfig.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
        
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit(1);
})

require('./routes/consent.route.js')(app);
require('./routes/user.route.js')(app);


app.listen(3000, ()=> {
    console.log("server just started at localhost:3000");
})