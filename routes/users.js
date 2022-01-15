const express = require('express');
const users = require('../controller/users'); //For all the user functions.
const router = express.Router(); //The Router library.
const auth = require('../config/auth');

/******************************
 *          ROUTES            *
 ******************************/
router.post('/users', users.register);
router.post('/users/login', users.login);
router.route('/user')
    .get(auth.required, users.currentUser)
    .put(auth.required, users.updateUser)
  

//End Routes

//Export the router
module.exports = router;
