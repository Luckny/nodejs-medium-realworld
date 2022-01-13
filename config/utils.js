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

   return {
      token: signedToken,
   };
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
module.exports.isEmpty = (obj) => {
   return Object.keys(obj).length === 0;
};

/**************************************************************
 *    THIS FUNCTION VERIFIES IF THE TWO OBJECTS HAVE AT LEAT
 *                ONE VALUE THAT REPEATS                      *
 **************************************************************/
module.exports.hasSameValue = (firstObj, secondObj) => {
   let isSameValue = false;
   let sameField = null;
   //for the key value pairs in the firstObj
   for (const keyInFirst in firstObj) {
      //for the key value pairs in the secondObj
      for (const keyInSecond in secondObj) {
         if (
            keyInFirst === keyInSecond &&
            firstObj[keyInFirst] === secondObj[keyInSecond]
         ) {
            isSameValue = true;
            sameField = keyInFirst;
         }
      }
   }

   return {
      isSameValue,
      sameField,
   };
};
