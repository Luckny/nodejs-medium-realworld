/**************************************************************************
 *          THIS FILE HAS THE auth express-jwt strategy configurarion     *
 **************************************************************************/
const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
   const {
      headers: { authorization },
   } = req;

   if (authorization && authorization.split(' ')[0] === 'Token') {
      return authorization.split(' ')[1];
   }
   return null;
};

const auth = {
   required: jwt({
      secret: process.env.JWT_SECRET,
      algorithms: ['HS256'],
      requestProperty: 'payload',
      getToken: getTokenFromHeaders,
   }),
   optional: jwt({
      secret: process.env.JWT_SECRET,
      algorithms: ['HS256'],
      requestProperty: 'payload',
      getToken: getTokenFromHeaders,
      credentialsRequired: false,
   }),
};

module.exports = auth;
