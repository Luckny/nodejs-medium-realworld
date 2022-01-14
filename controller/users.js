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
      const {
         username: name,
         email: mail,
         password: preHashedPw,
      } = req.body.user;
      const dbUser = await User.findOne({ username: name, email: mail });
      //if user exist
      if (dbUser) {
         return res
            .status(StatusCodes.UNPROCESSABLE_ENTITY)
            .json(utils.makeJsonError('User Already Exist!'));
      }

      //Create new User and save to DB.
      const newUser = new User({
         username: name,
         email: mail,
         password: preHashedPw,
      });
      const user = await newUser.save();

      //Making response Object
      const { email, username, bio, image } = user;
      const token = utils.genToken(user);
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
         const token = utils.genToken(dbUser);
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
module.exports.updateUser = async (req, res) => {
   try {
      const {
         username: name,
         email: mail,
         password,
         bio: biography,
         image: picture,
      } = req.body.user;

      //cannot update username
      if (name) {
         return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(utils.makeJsonError('Username Cannot Be Updated!'));
      }
      //verifies if the user from body has at least one field
      if (utils.hasNoKeys(req.body.user)) {
         return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(utils.makeJsonError('At Least One Field Is Required!'));
      }
      //if email or password exist, meaning they are not empty strings
      // but they only contain whiteSpaces, SEND ERROR
      if (
         (mail && utils.isWhiteSpace(mail)) ||
         (password && utils.isWhiteSpace(password))
      ) {
         return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(
               utils.makeJsonError(
                  'Cannot Update Email Or Password To Empty String'
               )
            );
      }
      //get tke token and payload from the verify token middleware(this will change)
      const { token, payload } = req.tokenAndPayload;
      //find user from database
      const oldUser = await User.findOne({ _id: payload.sub });
      //updating the fields
      oldUser.email = mail || oldUser.email;
      oldUser.bio = biography || oldUser.bio;
      oldUser.image = picture || oldUser.image;
      //if there is a password field and it is new, update it
      oldUser.password =
         password && utils.isNewPassword(password, oldUser)
            ? password
            : oldUser.password;

      //updating user
      const newUser = await oldUser.save();
      //Making response Object
      const { email, username, bio, image } = newUser;
      return res
         .status(StatusCodes.OK)
         .json({ user: { email, token, username, bio, image } });
   } catch (e) {
      console.log(e);
      return res
         .status(StatusCodes.UNAUTHORIZED)
         .json(utils.makeJsonError('Unexpected Error!'));
   }
};
