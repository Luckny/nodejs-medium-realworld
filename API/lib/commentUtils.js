const { Comment } = require("../models");
const utils = require("./utils");
const { StatusCodes } = require("http-status-codes");

/**
 * Create a new comment and saves it to the database.
 * @param {String} body The text of the comment.
 * @param {Article} article The article on with the comment is posted.
 * @param {User} author The user that makes the comment.
 * @returns the saved comment
 */
module.exports.newComment = async (body, article, author) => {
  const comment = new Comment({ body });
  comment.article = article;
  comment.author = author;
  return await comment.save();
};

/**
 * Returns a json format response array.
 * @param {Array} comments Array of comments
 * @param {User} currentUser The logged in user if there is one or null
 * @returns a json formatted reponse array with the comments
 */
module.exports.everyComment = async (comments, currentUser) => {
  const response = [];
  for (let comment of comments) {
    response.push(await comment.toAPIJson(currentUser));
  }
  return response;
};

/**
 * Returns 404 comment not found error
 * @param {*} res The response Objext
 * @returns A json error
 */
module.exports.commentNotFound = (res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json(utils.makeJsonError("Comment not found."));
};

module.exports.noAuthorization = (res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json(utils.makeJsonError("You do not have authorization"));
};
