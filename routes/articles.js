const express = require('express');
const articles = require('../controller/articles'); 
const router = express.Router(); 
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

//Favorite
router.route('/:slug/favorite')
    .post(auth.required, articles.addToFavorites)
    .delete(auth.required, articles.removeFromFavorites)


module.exports = router;
