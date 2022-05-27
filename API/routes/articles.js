const express = require("express");
const articles = require("../controller/articles");
const router = express.Router();
const auth = require("../lib/auth");
const wrapAsync = require("../lib/wrapAsync");

/******************************
 *          ROUTES            *
 ******************************/
router.get("/feed", auth.required, wrapAsync(articles.userFeed));
router
  .route("/")
  .get(auth.optional, wrapAsync(articles.getAll))
  .post(auth.required, wrapAsync(articles.createOne));

router
  .route("/:slug")
  .get(auth.optional, wrapAsync(articles.getOne))
  .put(auth.required, wrapAsync(articles.updateOne))
  .delete(auth.required, wrapAsync(articles.destroyOne));

//Favorite
router
  .route("/:slug/favorite")
  .post(auth.required, wrapAsync(articles.addToFavorites))
  .delete(auth.required, wrapAsync(articles.removeFromFavorites));

module.exports = router;
