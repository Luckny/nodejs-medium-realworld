
const { User } = require('../models');//The User model.
const utils = require('../config/utils');//Hashing library.
const passport = require('passport')
const jwt = require('jsonwebtoken')


/**
 * This function registers a new user
 *      Getting the user information from the request body object.
 *      Creating the user with the User model. 
 *      Hashing the newUser password and adding it to the user.
 *      Saving the user to the database.
 *      Getting the user we just created from the database so we can access all the other fields.
 *      Making an object with the wanted field from the user we got.
 *      Set status to "created", and send back the user in JSON format.
 *      
 * @param {Object} req - The Request Object
 * @param {Object} res - The Response Object
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
        res.status(201).json({ user: { email, username, bio, image, token } });
    } catch (e) {
        res.sendStatus(422)
    }

}


module.exports.login = async (req, res) => {

    try {
        const { email, password } = req.body.user;
        const dbUser = await User.findOne({ email });
        if (!dbUser) {
            return res.sendStatus(401);
        }

        const valid = await utils.verifyPassword(dbUser, password);

        if (valid) {
            const token = utils.genToken(dbUser)
            const { username, bio, image } = dbUser;
            res.status(200).json({ user: { email, username, bio, image, token } });
        } else {
            res.sendStatus(401)
        }


    } catch (e) {
        res.sendStatus(422)
    }

}





