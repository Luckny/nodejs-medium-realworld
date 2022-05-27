const express = require('express');
const comments = require('../controller/comments'); //For all the articles functions.
const router = express.Router(); //The Router library.
const auth = require('../config/auth');
const wrapAsync = require("../config/utils/wrapAsync")


/******************************
 *          ROUTES            *
 ******************************/
router.route('/:slug/comments')
    .get(auth.optional, wrapAsync(comments.getAll))
    .post(auth.required, wrapAsync(comments.createOne))

 router.delete("/:slug/comments/:id",auth.required, wrapAsync(comments.destroyOne))


module.exports = router;