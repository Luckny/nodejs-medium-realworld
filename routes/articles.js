const express = require('express');
const articles = require('../controller/users'); //For all the articles functions.
const router = express.Router(); //The Router library.
const auth = require('../config/auth');

/******************************
 *          ROUTES            *
 ******************************/
router.get('/feed', auth.required, articles.getFeed);
router.route('/')
    .get(auth.optional, articles.all)
    .post(auth.required, articles.createArticle)

router.route('/:slug')
    .get(auth.optional, articles.getOne)
    .put(auth.required, articles.updateOne)
    .delete(auth.required, articles.destroy)



//End Routes

//Export the router
module.exports = router;
