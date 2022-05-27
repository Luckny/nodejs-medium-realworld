const express = require('express');
const profiles = require('../controller/profiles');
const router = express.Router(); //The Router library.
const auth = require('../config/auth');
const wrapAsync = require("../config/utils/wrapAsync")

/******************************
 *          ROUTES            *
 ******************************/
router.get('/:username', auth.optional, wrapAsync(profiles.getProfile));
router.route('/:username/follow')
    .post(auth.required, wrapAsync(profiles.follow))
    .delete(auth.required, wrapAsync(profiles.unfollow) )


module.exports = router;
