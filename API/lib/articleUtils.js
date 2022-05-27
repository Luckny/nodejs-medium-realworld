const utils = require("./utils");
const { StatusCodes } = require("http-status-codes");
const { Article } = require("../models");

/**
 *This function returns a not found error
 * @param {Response} res The response object
 * @returns NOT_FOUND ERROR
 */
module.exports.articleNotFound = (res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json(utils.makeJsonError("Article not found."));
};
