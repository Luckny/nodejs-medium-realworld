/*******************************************************************
 *      This file has a lot of usefull functions for the app       *
 *******************************************************************/
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/********************************************************
 *                 BCRYPT VERIFY                        *
 ********************************************************/
module.exports.verifyPassword = async (User, password) => {
   return await bcrypt.compare(password, User.password);
};
//END BCRYPT

/*********************************
 *         GENERATE JWT          *
 *********************************/
module.exports.genToken = (User) => {
   const _id = User._id;
   const expiresIn = '1d';
   const payload = {
      sub: _id,
      iat: Date.now(),
   };

   const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
   });

   return signedToken;
};

/********************************************
 *    TO GENERATE A JSON ERROR OBJECT       *
 ********************************************/
module.exports.makeJsonError = (message) => {
   const errors = {
      errors: {
         body: [message],
      },
   };
   return errors;
};

/**************************************************************
 *    THIS FUNCTION VERIFIES AND OBJECT IS EMPTY OR NOT       *
 **************************************************************/
module.exports.hasNoKeys = (user) => {
   return Object.keys(user).length === 0;
};

/**************************************************************
 *    THIS FUNCTION RETURNS TRUE IF A STRING ELEMENT
 *             ONLY HAS WHITESPACES                           *
 **************************************************************/
/**
 * PS: I found out that an empty String "" evaluates to falsy in
 *    js world so i do not need to check for that here.
 * @param {*} value
 * @returns
 */
module.exports.isWhiteSpace = (value) => {
   return !value.trim();
};

/**************************************************************
 *    THIS FUNCTION VERIFIES IF THE PROVIDED PASSWORD IS NEW  *
 **************************************************************/
module.exports.isNewPassword = async function (newPassword, user) {
   return !(await this.verifyPassword(user, newPassword));
};
