const express = require('express');
const passport = require('passport');
const users = require('../controller/users'); //For all the user functions.
const router = express.Router(); //The Router library.
require('../config/passport');

/******************************
 *          ROUTES            *
 ******************************/
router.post('/users', users.register);
router.post('/users/login', users.login);
router.route('/user')
    .get(users.currentUser)
  

//End Routes

//Export the router
module.exports = router;
