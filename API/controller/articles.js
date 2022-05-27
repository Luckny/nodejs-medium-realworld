const { Article, User } = require("../models"); //The User model.
const utils = require("../lib/utils");
const { StatusCodes } = require("http-status-codes");

/**
 * This function gets the recent articles from the users
 * that the current user follows
 */
module.exports.userFeed = async (req, res) => {
  const {
    payload: { id },
  } = req;
  const loggedInUser = await User.findById(id);
  const articles = await Article.find({
    author: { $in: loggedInUser.following },
  }).sort({ updatedAt: -1 });
  return articleResponse(res, articles, loggedInUser);
};

/**
 * This function gets all the recent articles globally
 */
module.exports.getAll = async (req, res) => {
  const {
    query: { author, tag, favorited },
    payload,
  } = req;
  const id = payload ? payload.id : null;
  //get the logged in user if there is one
  const loggedInUser = await User.findById(id);
  //if there is a query element
  if (author) return await byAuthor(res, author, loggedInUser);
  if (favorited) return await byFavorites(res, favorited, loggedInUser);
  if (tag) return await byTag(res, tag, loggedInUser);

  //if there is no query
  return await everyArticles(res, loggedInUser);
};

/**
 * This function creates an article
 */
module.exports.createOne = async (req, res) => {
  const { title, description, body, tagList } = req.body.article;
  const {
    payload: { id },
  } = req;

  //getting the logged in user
  const loggedInUser = await User.findById(id);
  //creating the new article
  const article = new Article({
    slug: "newslug",
    title,
    description,
    body,
    tagList,
    author: loggedInUser,
  });

  const createdArticle = await article.save();

  return res.status(StatusCodes.OK).json(await createdArticle.toAPIJson(loggedInUser));
};

/**
 * This function fetches a particular article
 */
module.exports.getOne = async (req, res) => {
  const {
    params: { slug },
    payload,
  } = req;

  const id = payload ? payload.id : null;

  //find the logged in user if there is one
  const loggedInUser = await User.findById(id);
  const article = await Article.findOne({ slug });
  //if article doesnt exist
  if (!article) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(utils.makeJsonError("Article Not Found!"));
  }
  //if we make it to that point, we have an article
  return res.status(StatusCodes.OK).json(await article.toAPIJson(loggedInUser));
};

/**
 * This function Updates one article
 */
module.exports.updateOne = async (req, res) => {
  const {
    params: { slug },
    payload: { id },
  } = req;

  const { title, description, body, tagList } = req.body.article;
  //Getting the logged in user
  const loggedInUser = await User.findById(id);
  //The article
  const article = await Article.findOne({ slug });
  if (!article)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(utils.makeJsonError("Article not found!"));
  //if the logged in user is not the author
  if (!(await article.isAuthor(loggedInUser)))
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(utils.makeJsonError("You do not have authorization!"));

  //updating the article
  article.title = title ?? article.title;
  article.description = description ?? article.description;
  article.body = body ?? article.body;
  article.tagList = tagList ?? article.tagList;
  const newArticle = await article.save();

  return res.status(StatusCodes.OK).json(await newArticle.toAPIJson(loggedInUser));
};

/**
 * This function Deletes one article
 */
module.exports.destroyOne = async (req, res) => {
  const {
    payload: { id },
    params: { slug },
  } = req;
  //getting the logged in user
  const loggedInUser = await User.findById(id);
  //getting the article
  const article = await Article.findOne({ slug });
  if (!article)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(utils.makeJsonError("Article not found!"));
  //if the logged in user is not the author
  if (!(await article.isAuthor(loggedInUser)))
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(utils.makeJsonError("You do not have authorization!"));

  await Article.findByIdAndDelete(article._id);
  return res.sendStatus(StatusCodes.OK);
};

/************************************************
 *                FAVORITE
 ***********************************************/
module.exports.addToFavorites = async (req, res) => {
  const {
    params: { slug },
    payload,
  } = req;

  //getting the logged in user
  const loggedInUserId = payload.id;
  const loggedInUser = await User.findById(loggedInUserId);

  //getting the article
  const article = await Article.findOne({ slug: slug });
  //if it doesnt exist, send error
  if (!article)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(utils.makeJsonError("Article not Found!"));

  //add the article to the logged in user favorites
  await loggedInUser.addToFavorites(article);

  return res.status(StatusCodes.OK).json(await article.toAPIJson(loggedInUser));
};

module.exports.removeFromFavorites = async (req, res) => {
  const {
    params: { slug },
    payload,
  } = req;

  //getting the logged in user
  const loggedInUserId = payload.id;
  const loggedInUser = await User.findById(loggedInUserId);

  //getting the article
  const article = await Article.findOne({ slug: slug });

  //if it doesnt exist, send error
  if (!article)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(utils.makeJsonError("Article not Found!"));

  //remove the found article from the logged in user favorites
  await loggedInUser.removeFromFavorites(article);
  return res.status(StatusCodes.OK).json(await article.toAPIJson(loggedInUser));
};

/**********************************************
 *             HELPER FUNCTIONS
 **********************************************/

/**
 * This function returns every articles in the database
 * @param {*} res
 * @param {*} user
 * @returns
 */
const everyArticles = async (res, loggedInUser) => {
  //get all articles
  const articles = await Article.find({}).sort({ updatedAt: -1 });
  articleResponse(res, articles, loggedInUser);
};

/**
 * This helper functions returns all articles with the same author.
 * @param {*} res
 * @param {*} authorUsername
 * @param {*} loggedInUser
 * @returns
 */
const byAuthor = async (res, authorUsername, loggedInUser) => {
  //find the author id
  const author = await User.findOne({ username: authorUsername });
  if (!author) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(utils.makeJsonError("Author not found"));
  }
  //get all the articles from that author
  const articles = await Article.find({ author: author._id }).sort({ updatedAt: -1 });
  articleResponse(res, articles, loggedInUser);
};

/**
 * This helper function returns all the articles favorited by the passed in user username
 * @param {*} res
 * @param {*} favoritorUsername
 * @param {*} loggedInUser
 */
const byFavorites = async (res, favoritorUsername, loggedInUser) => {
  const userWhoFavorited = await User.findOne({ username: favoritorUsername });
  if (!userWhoFavorited) {
    return res.status(StatusCodes.NOT_FOUND).json(utils.makeJsonError("User not found"));
  }
  const { favorites } = userWhoFavorited;
  //all the articles in the favorites array
  const articles = await Article.find({ _id: { $in: favorites } }).sort({
    updatedAt: -1,
  });
  articleResponse(res, articles, loggedInUser);
};

/**
 * This helper function returns all the articles that has the recieved tag.
 * @param {*} res
 * @param {*} tag
 * @param {*} loggedInUser
 */
const byTag = async (res, tag, loggedInUser) => {
  //get all the articles with that tag
  const articles = await Article.find({ tagList: tag }).sort({ updatedAt: -1 });
  articleResponse(res, articles, loggedInUser);
};

/**
 * this function returns either a not found article error or an article
 */
const articleResponse = async (res, articles, loggedInUser) => {
  //if there is no articles
  if (articles.length < 1 || !articles) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(utils.makeJsonError("Cannot find any articles!"));
  }
  //return the response
  return res
    .status(StatusCodes.OK)
    .json(await utils.makeArticlesResponse(articles, loggedInUser));
};
