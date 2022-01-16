const { User } = require('../models'); //The User model.
const utils = require('../config/utils'); //Hashing library.
const {
   ReasonPhrases,
   StatusCodes,
   getReasonPhrase,
   getStatusCode,
} = require('http-status-codes');

/**
 * This function registers a user with a hashed password and
 * returns the registered user in JSON.
 * @param {*} req
 * @param {*} res
 */
module.exports.register = async (req, res) => {
   try {
      const { username, email, password } = req.body.user;
      const dbUser = await User.findOne({ username, email });
      //if user exist
      if (dbUser) {
         return res
            .status(StatusCodes.UNPROCESSABLE_ENTITY)
            .json(utils.makeJsonError('User Already Exist!'));
      }

      //Create new User and save to DB.
      const newUser = new User({
         username,
         email,
         password,
      });
      const user = await newUser.save();
      return res.status(StatusCodes.OK).json(user.toUserJson());
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
      const { email, password } = req.body.user;
      const dbUser = await User.findOne({ email });

      //if user doesnt exits
      if (!dbUser) {
         return res
            .status(StatusCodes.NOT_FOUND)
            .json(utils.makeJsonError('User Not Found!'));
      }

      //if valid password
      if (await dbUser.isValidPassword(password)) {
         return res.status(StatusCodes.OK).json(dbUser.toUserJson());
      } else {
         //if INVALID password
         return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(utils.makeJsonError('Invalid Password!'));
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
      const {
         payload: { id },
      } = req;

      const user = await User.findById(id);
      //if user is not in database
      if (!user) {
         return res
            .status(StatusCodes.NOT_FOUND)
            .json(utils.makeJsonError('User Not Found!'));
      }
      //RESPONSE
      return res.status(StatusCodes.OK).json(user.toUserJson());
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
module.exports.updateUser = async (req, res, next) => {
   try {
      /**
       * if a user tries:
       *    to update a username,
       *    to update with an empty user Object,
       *    to update with an email or password that only has whitespaces
       * there will me a message in the update variable.
       */
      const { update, message } = utils.verifyUpdate(req.body);
      if (!update) {
         return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(utils.makeJsonError(message));
      }
      //get tke token and payload from the verify token middleware(this will change)
      const {
         payload: { id },
      } = req;
      //find user from database
      const oldUser = await User.findById(id);
      if (!oldUser) {
         return res
            .status(StatusCodes.NOT_FOUND)
            .json(utils.makeJsonError('User Not Found!'));
      }
      //updating the fields
      const { email, bio, password, image } = req.body.user;
      oldUser.email = email ?? oldUser.email;
      oldUser.bio = bio ?? oldUser.bio;
      oldUser.image = image ?? oldUser.image;
      //if there is a password field and it is new, update it
      if (password) {
         const isSamePassword = await oldUser.isValidPassword(password);
         if (!isSamePassword) oldUser.password = password;
      }

      //updating user
      const newUser = await oldUser.save();
      //RESPONSE
      return res.status(StatusCodes.OK).json(newUser.toUserJson());
   } catch (e) {
      console.log(e);
      return res
         .status(StatusCodes.UNAUTHORIZED)
         .json(utils.makeJsonError('Unexpected Error!'));
   }
};
