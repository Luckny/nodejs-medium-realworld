
const { User } = require('../models');//The User model.
const { hashPassword, genToken } = require('../config/utils');//Hashing library.
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
        await User.deleteOne({ username })//For testing purposes, delete line before pushing to git
        const newUser = await hashPassword(new User({ username, email }), password);
        await newUser.save();
        const result = await User.findOne({ username, email });
        console.log(result)//For testing purposes, delete line before pushing to git
        const token = genToken(result);
        const user = (({ email, username, bio, image }) => ({ email, username, bio, image }))(result);
        user.token = token;
        res.status(201).json({ user });
    } catch (e) {
        console.log(e)
        res.sendStatus(422)
    }


}


module.exports.login = async (req, res) => {
    console.log(req.headers)
    res.sendStatus(200)
}





