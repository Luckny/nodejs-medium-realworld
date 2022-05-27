const { Article, User, Comment } = require("../models");
const commentUtils = require("../lib/commentUtils");
const articleUtils = require("../lib/articleUtils");
const utils = require("../lib/utils");
const { StatusCodes } = require("http-status-codes");

/**
 * This function returns all the comment on a particular article.
 * @param {*} req The req Object
 * @param {*} res The res Object
 * @returns A json response object
 */
module.exports.getAll = async (req, res) => {
  const { payload } = req;
  const { slug } = req.params;
  let loggedInUser = null;
  //if a user is logged in, get them
  if (utils.isAuthenticated(req)) loggedInUser = await User.findById(payload.id);

  //getting the article or returning error
  const article = await Article.findOne({ slug })
    .populate("comments")
    .sort({ updatedAt: -1 });
  if (!article) return articleUtils.articleNotFound(res);

  //The response object
  const response = await commentUtils.everyComment(article.comments, loggedInUser);
  return res.status(StatusCodes.OK).json({ comments: response });
};

/**
 * This function creates a new comment from the elements recieved
 * from the req object, saves it and return a json of if.
 * @param {*} req The req Object
 * @param {*} res The res Object
 * @returns A json response object
 */
module.exports.createOne = async (req, res) => {
  const {
    params: { slug },
    payload,
    body: {
      comment: { body },
    },
  } = req;
  //geting the article and the logged in user
  const article = await Article.findOne({ slug });
  //if it doenst exist return an error
  if (!article) return articleUtils.articleNotFound(res);
  //getting the logged in user
  const loggedInUser = await User.findById(payload.id);
  //creating and saving the comment to the database
  const comment = await commentUtils.newComment(body, article, loggedInUser);
  //The response object
  const response = await comment.toAPIJson(loggedInUser);
  return res.status(StatusCodes.OK).json({ comment: response });
};

module.exports.destroyOne = async (req, res, next) => {
  const { payload } = req;
  const { slug, id: commentId } = req.params;

  //getting the logged in user
  const loggedInUser = await User.findById(payload.id);

  //get the article and return an error if you cant
  const article = await Article.findOne({ slug });
  if (!article) return articleUtils.articleNotFound(res);

  //get the comment and return an error if you cant
  const comment = await Comment.findById(commentId);
  if (!comment) return commentUtils.commentNotFound(res);

  if (!comment.isAuthor(loggedInUser)) return commentUtils.noAuthorization(res);
  await Comment.deleteOne({ _id: commentId });
  //delete the comment from the article's comment array
  const art = await article.deleteComment(commentId);

  //answer
  return res.sendStatus(StatusCodes.OK);
};
