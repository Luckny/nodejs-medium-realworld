const { User } = require('../models'); //The User model.
const utils = require('../config/utils'); //Hashing library.
const jwt = require('jsonwebtoken');
const {
   ReasonPhrases,
   StatusCodes,
   getReasonPhrase,
   getStatusCode,
} = require('http-status-codes');
const JwtStrategy = require('passport-jwt/lib/strategy');
/**
 * This function registers a user with a hashed password and
 * returns the registered user in JSON.
 * @param {*} req
 * @param {*} res
 */
module.exports.register = async (req, res) => {
   try {
      const { username: name, email: mail, password } = req.body.user;
      const dbUser = await User.findOne({ username: name, email: mail });
      //if user exist
      if (dbUser) {
         return res
            .status(StatusCodes.UNPROCESSABLE_ENTITY)
            .json(utils.makeJsonError('User Already Exist!'));
      }

      //Create new User and save to DB.
      const newUser = new User({ username: name, email: mail });
      newUser.password = await utils.hashPassword(password);
      const user = await newUser.save();

      //Making response Object
      const { email, username, bio, image } = user;
      const token = utils.genToken(user).token;
      return res.status(StatusCodes.CREATED).json({
         user: { email, token, username, bio, image },
      });
   } catch (e) {
      console.log(e);
      return res
         .status(StatusCodes.INTERNAL_SERVER_ERROR)
         .json(utils.makeJsonError('Unexpected Error!'));
   }
};

/**
 * This function is used to log in a user.
 * It verifies the password and if the user is valid
 * returns the user in JSON.
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.login = async (req, res) => {
   try {
      const { email: mail, password } = req.body.user;
      const dbUser = await User.findOne({ email: mail });

      //if user doesnt exits
      if (!dbUser) {
         return res
            .status(StatusCodes.NOT_FOUND)
            .json(utils.makeJsonError('User Not Found!'));
      }

      const valid = await utils.verifyPassword(dbUser, password);
      //if valid password
      if (valid) {
         //Making response Object
         const token = utils.genToken(dbUser).token;
         const { email, username, bio, image } = dbUser;
         res.status(StatusCodes.OK).json({
            user: { email, token, username, bio, image },
         });
      } else {
         //if INVALID password
         res.status(StatusCodes.UNAUTHORIZED).json(
            utils.makeJsonError('Invalid Password!')
         );
      }
   } catch (e) {
      console.log(e);
      return res
         .status(StatusCodes.INTERNAL_SERVER_ERROR)
         .json(utils.makeJsonError('Unexpected Error!'));
   }
};

/**
 *This Function returns the current logged in user if he is authenticated.
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.currentUser = async (req, res) => {
   try {
      //from verify token middlewated
      const { token, payload } = req.tokenAndPayload;

      //const token = req.headers.authorization.split(' ')[1];

      const user = await User.findOne({ _id: payload.sub });
      //if user is not in database
      if (!user) {
         return res
            .status(StatusCodes.NOT_FOUND)
            .json(utils.makeJsonError('User Not Found!'));
      }

      //Making response Object
      const { email, username, bio, image } = user;
      return res
         .status(StatusCodes.OK)
         .json({ user: { email, token, username, bio, image } });
   } catch (e) {
      console.log(e);
      return res
         .status(StatusCodes.UNPROCESSABLE_ENTITY)
         .json(utils.makeJsonError('Unexpected Error'));
   }
};

/**
 * This function Updates the current user information if he is authenticated
 * @param {*} req
 * @param {*} res
 */
module.exports.updateUser = async (req, res) => {};
