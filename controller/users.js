const { User } = require('../models'); //The User model.
const utils = require('../config/utils'); //Hashing library.

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
      const { bio, image } = user;
      const token = utils.genToken(user);
      res.status(201).json({
         user: { email, username, bio, image, token },
      });
   } catch (e) {
      res.sendStatus(422);
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
         const { username, bio, image } = dbUser;
         res.status(200).json({
            user: { email, username, bio, image, token },
         });
      } else {
         res.sendStatus(401);
      }
   } catch (e) {
      res.sendStatus(422);
   }
};
