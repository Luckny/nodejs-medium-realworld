const express = require('express');
const passport = require('passport');
const users = require('../controller/users')//For all the user functions.
const router = express.Router();//The Router library.
require('../config/passport')

/******************************
 *          ROUTES            *    
 ******************************/
router.post('/users', users.register);
router.post('/users/login', passport.authenticate('jwt', { session: false }), users.login)

//End Routes


//Export the router
module.exports = router;