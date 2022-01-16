const express = require('express');
const profiles = require('../controller/profiles');
const router = express.Router(); //The Router library.
const auth = require('../config/auth');

/******************************
 *          ROUTES            *
 ******************************/
router.get('/:username', auth.optional, profiles.getProfile);
router.route('/:username/follow')
    .post(auth.required, profiles.follow)

//End Routes

//Export the router
module.exports = router;
