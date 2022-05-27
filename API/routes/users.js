const express = require("express");
const users = require("../controller/users"); //For all the user functions.
const router = express.Router(); //The Router library.
const auth = require("../lib/auth");
const wrapAsync = require("../lib/wrapAsync");

/******************************
 *          ROUTES            *
 ******************************/
router.post("/users", wrapAsync(users.register));
router.post("/users/login", wrapAsync(users.login));
router
  .route("/user")
  .get(auth.required, wrapAsync(users.currentUser))
  .put(auth.required, wrapAsync(users.updateUser));

module.exports = router;
