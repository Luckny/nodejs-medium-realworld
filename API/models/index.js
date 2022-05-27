/*****************************************************************
 *      This file requires and exports all the Models
 *****************************************************************/
const User = require('./users');
const Article = require('./articles');
const Comment = require('./comment');
const Tag = require('./tags');

module.exports = {
   User,
   Article,
   Comment,
   Tag,
};
