require('dotenv').config(); //to use .env variables
const express = require('express');
const config = require('./config');//Contains the mongoose configuration
const passport = require('passport');//For Authentification
const { User } = require('./models');//The User model.
const { urlencoded } = require('express');
const { userRoutes } = require('./routes');
const app = express();

/******************************
 *  APPLICATION MIDDLEWARES   *
 ******************************/
app.use(urlencoded({ extended: true }))
app.use(express.json())
//End MiddleWares.



/**
 * This function uses the mongoose config in the loaders/index to 
 * Start the mongoose connection and then sets the listening port
 * for the express application.
 */
async function startServer(port) {


    await config.init();

    app.listen(port, () => {
        console.log('Serving on port 3000')
    })

}


/******************************
 *          ROUTES            *
 ******************************/
app.use('/users', userRoutes);



//Starts the Server
startServer(3000);