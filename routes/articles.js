const express = require('express');
const articles = require('../controller/users'); //For all the articles functions.
const router = express.Router(); //The Router library.
const auth = require('../config/auth');

/******************************
 *          ROUTES            *
 ******************************/
router.get('/feed', auth.required, articles.userFeed);
router.route('/')
    .get(auth.optional, articles.getAll)
    .post(auth.required, articles.createOne)

router.route('/:slug')
    .get(auth.optional, articles.getOne)
    .put(auth.required, articles.updateOne)
    .delete(auth.required, articles.destroyOne)



//End Routes

//Export the router
module.exports = router;
