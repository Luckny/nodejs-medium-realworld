require('dotenv').config(); //to use .env variables
const express = require('express');
const loaders = require('./loaders');//Contains the mongoose configuration
const passport = require('passport');//For Authentification
const strategy = require('./loaders/passport');//Contains the passport-jwt configuration logic
const { User } = require('./models');//The User model.
const { userRoutes } = require('./routes');//The Routes
const { urlencoded } = require('express');
const app = express();

/******************************
 *  APPLICATION MIDDLEWARES   *
 ******************************/
app.use(urlencoded({ extended: true }))
app.use(express.json())
//End MiddleWares.

passport.use(strategy)


/**
 * This function uses the mongoose config in the loaders/index to 
 * Start the mongoose connection and then sets the listening port
 * for the express application.
 */
async function startServer(port) {


    await loaders.init();

    app.listen(port, () => {
        console.log('Serving on port 3000')
    })

}

/******************************
 *          ROUTES            *
 ******************************/
app.use('/users', userRoutes)

//End Routes.


//Starts the Server
startServer(3000);


