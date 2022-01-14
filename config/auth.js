/**************************************************************************
 *          THIS FILE HAS THE auth express-jwt strategy configurarion     *
 **************************************************************************/
const jwt = require('express-jwt');

const options = {
   secret: process.env.JWT_SECRET,
   algorithms: ['HS256'],
};
