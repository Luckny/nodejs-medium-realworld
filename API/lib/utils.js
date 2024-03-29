/*******************************************************************
 *      This file has a lot of usefull functions for the app       *
 *******************************************************************/
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

/*********************************
 *         GENERATE JWT          *
 *********************************/
module.exports.genToken = (User) => {
  const _id = User._id;
  const expiresIn = "1d";
  const payload = {
    id: _id,
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
 *  THIS FUNCTION RETURNS TRUE VERIFY IF THE UPDATE REQUREST  *
 *                       IS VALID                             *
 **************************************************************/
module.exports.verifyUpdate = (body) => {
  const { username, email, password } = body.user;
  let message = "";
  //cannot update username
  if (username) message = "Username Cannot Be Updated!";

  //verifies if the user from body has at least one field
  if (this.hasNoKeys(body.user)) message = "At Least One Field Is Required!";

  //if email or password exist, meaning they are not empty strings
  // but they only contain whiteSpaces, SEND ERROR
  if (
    (email && this.isWhiteSpace(email)) ||
    (password && (password.length === 0) | this.isWhiteSpace(password))
  )
    message = "Cannot Update Email Or Password To Empty String";

  return message ? { update: false, message } : { update: true };
};

module.exports.makeArticlesResponse = async (articles, loggedInUser) => {
  const response = [];
  for (let article of articles) {
    response.push(await article.toAPIJson(loggedInUser));
  }
  return { articles: response, articlesCount: response.length };
};

/**
 * This function returns true if a user is logged in
 * @param {*} req The request object
 * @returns The true or false
 */
module.exports.isAuthenticated = (req) => {
  const { payload } = req;
  return payload && payload.id ? true : false;
};
