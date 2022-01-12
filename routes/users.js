const express = require('express');
const users = require('../controller/users')//For all the user functions.
const router = express.Router();//The Router library.


/******************************
 *          ROUTES            *    
 ******************************/
router.post('/', users.register)

//End Routes


//Export the router
module.exports = router;