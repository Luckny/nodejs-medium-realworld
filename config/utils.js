/*******************************************************************
 *      This file has a lot of usefull functions for the app       *
 *******************************************************************/
const { User } = require('../models');
const jwt = require('jsonwebtoken');

/********************************************************
 *                 BCRYPT HASH AND VERIFY           *
 ********************************************************/
const bcrypt = require('bcrypt');
module.exports.hashPassword = async (password) => {
   salt = await bcrypt.genSalt(10);
   return await bcrypt.hash(password, salt);
};

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
module.exports.hasEmptyField = (user) => {
   return Object.keys(user).length === 0;
};

/**************************************************************
 *    THIS FUNCTION VERIFIES IF THE TWO OBJECTS HAVE AT LEAT
 *                ONE VALUE THAT REPEATS                      *
 **************************************************************/
module.exports.hasSameValue = async (newUser, oldUser) => {
   //for the key value pairs in the firstObj
   for (const keyInNewUser in newUser) {
      //for the key value pairs in the secondObj
      for (const keyInOldUser in oldUser) {
         //I.E if we have email in the first key and email in second key, next line runs
         if (keyInNewUser === keyInOldUser) {
            //if it's the password field
            if (keyInNewUser === 'password') {
               isSamePassword = await this.verifyPassword(
                  oldUser,
                  newUser[keyInNewUser]
               );
               return {
                  isSameValue: isSamePassword,
                  sameField: isSamePassword ? keyInNewUser : null,
                  isSamePassword,
               };
            } else if (newUser[keyInNewUser] === oldUser[keyInOldUser]) {
               return {
                  isSameValue: true,
                  sameField: keyInOldUser,
               };
            }
         }
      }
   }

   return {
      isSameValue: false,
      isSamePassword: false,
   };
};
