/*****************************************************************
 *      This file requires and exports all the Routes
 *****************************************************************/
const userRoutes = require('./users');
const profileRoutes = require('./profiles');

module.exports = {
   userRoutes,
   profileRoutes,
};
