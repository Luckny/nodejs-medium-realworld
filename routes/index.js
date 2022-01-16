/*****************************************************************
 *      This file requires and exports all the Routes
 *****************************************************************/
const userRoutes = require('./users');
const profileRoutes = require('./profiles');
const articleRoutes = require('./articles')

module.exports = {
   userRoutes,
   profileRoutes,
   articleRoutes
};
