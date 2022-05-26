const express = require('express');
const comments = require('../controller/comments'); //For all the articles functions.
const router = express.Router(); //The Router library.
const auth = require('../config/auth');


/******************************
 *          ROUTES            *
 ******************************/
router.route('/:slug/comments')
    .get(auth.optional, comments.getAll)
    .post(auth.required, comments.createOne)

 router.delete("/:slug/comments/:id",auth.required, comments.destroyOne)


module.exports = router;