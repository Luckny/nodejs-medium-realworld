const express = require('express');
const articles = require('../controller/users'); //For all the articles functions.
const router = express.Router(); //The Router library.
const auth = require('../config/auth');

/******************************
 *          ROUTES            *
 ******************************/
router.get('/feed', auth.required, articles.getFeed);

//End Routes

//Export the router
module.exports = router;
