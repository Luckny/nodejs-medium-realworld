const { User } = require('../models'); //The User model.
const utils = require('../config/utils'); //Hashing library.
const { db } = require('../models/users');

/**
 * This function registers a user with a hashed password and
 * returns the registered user in JSON.
 * @param {*} req
 * @param {*} res
 */
module.exports.register = async (req, res) => {
   try {
      const { username, email, password } = req.body.user;
      const newUser = new User({ username, email });
      newUser.password = await utils.hashPassword(password);
      await newUser.save();
      const user = await User.findOne({ username, email });
      const { email: mail, username: name, bio, image } = user;
      const token = utils.genToken(user).token;
      res.status(201).json({
         user: { mail, name, bio, image, token },
      });
   } catch (e) {
      console.log(e);
      res.sendStatus(422);
      //unknown server error 500
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

      if (!dbUser) {
         return res.sendStatus(401);
      }

      const valid = await utils.verifyPassword(dbUser, password);

      if (valid) {
         const token = utils.genToken(dbUser);
         const { email: mail, username, bio, image } = dbUser;
         res.status(200).json({
            user: { mail, username, bio, image, token },
         });
      } else {
         res.sendStatus(401);
      }
   } catch (e) {
      console.log(e);
      res.sendStatus(422);
   }
};
