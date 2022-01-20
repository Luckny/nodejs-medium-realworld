const { Article, User } = require('../models'); //The User model.
const utils = require('../config/utils'); //Hashing library.
const { StatusCodes } = require('http-status-codes');
const randomCharacters = require('unique-slug');
const makeSlug = require('slug');
const print = console.log.bind(console, '>');

/**
 * This function gets the recent articles from the users
 * that the current user follows
 */
module.exports.userFeed = async (req, res) => {
   res.send('The current user feed');
};

/**
 * This function gets all the recent articles globally
 */
module.exports.getAll = async (req, res) => {
   //get the filter from hte query
   const filter = req.query;
   console.log(filter);
   res.send('All the articles');
};

/**
 * This function creates an article
 * NB: i will use the Mongodb _id as slug
 */
module.exports.createOne = async (req, res) => {
   try {
      const { article: newArticle } = req.body;
      const {
         payload: { id },
      } = req;

      //getting the logged in user
      const loggedInUser = await User.findById(id);
      //Making a unique slug
      const slug = makeSlug(`${newArticle.title} ${randomCharacters()}`);
      //creating the new article
      const article = new Article(newArticle);
      article.slug = slug;
      article.author = loggedInUser;

      const createdArticle = await article.save();

      return res
         .status(StatusCodes.OK)
         .json(createdArticle.toAPIJson(loggedInUser, loggedInUser));
   } catch (e) {
      console.log(e);
      return res
         .status(StatusCodes.INTERNAL_SERVER_ERROR)
         .json(utils.makeJsonError('Unexpected Error!'));
   }
};

/**
 * This function fetches a particular article
 */
module.exports.getOne = async (req, res) => {
   res.send('Getting one article');
};

/**
 * This function Updates one article
 */
module.exports.updateOne = async (req, res) => {
   res.send('Updating one');
};

/**
 * This function Deletes one article
 */
module.exports.destroyOne = async (req, res) => {
   res.send('Destroying one');
};
