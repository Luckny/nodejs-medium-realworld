const { Article } = require('../models'); //The User model.
const utils = require('../config/utils'); //Hashing library.
const { StatusCodes } = require('http-status-codes');

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
   res.send('All the articles');
};

/**
 * This function creates an article
 */
module.exports.createOne = async (req, res) => {
   res.send('Creating one...');
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
