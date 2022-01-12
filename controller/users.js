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
      const { username: name, email: mail, password } = req.body.user;
      const dbUser = await User.findOne({ username: name, email: mail });
      //if user exist
      if (dbUser) {
         return res
            .status(StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ errors: { body: ['User already exist.'] } });
      }

      //Create new User and save to DB.
      const newUser = new User({ username: name, email: mail });
      newUser.password = await utils.hashPassword(password);
      const user = await newUser.save();

      //Making response Object
      const { email, username, bio, image } = user;
      const token = utils.genToken(user).token;
      return res.status(StatusCodes.CREATED).json({
         user: { email, username, bio, image, token },
      });
   } catch (e) {
      console.log(e);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         errors: { body: ['Unexpected Server Error'] },
      });
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
            .json({ errors: { body: ['User Not Found!'] } });
      }

      const valid = await utils.verifyPassword(dbUser, password);
      //if valid password
      if (valid) {
         //Making response Object
         const token = utils.genToken(dbUser);
         const { email, username, bio, image } = dbUser;
         res.status(StatusCodes.OK).json({
            user: { email, username, bio, image, token },
         });
      } else {
         //if INVALID password
         res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { body: ['INVALID PASSWORD OR EMAIL!'] },
         });
      }
   } catch (e) {
      console.log(e);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         errors: { body: ['Unexpected Server Error'] },
      });
   }
};
