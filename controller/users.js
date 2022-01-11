
const { User } = require('../models');//The User model.
const bcrypt = require('bcrypt');//Hashing library.

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
    const { username, email, password } = req.body.user;
    await User.deleteOne({ username });//This is for testing purposes only, Delete line before pushing.
    const newUser = new User({ username, email });
    newUser.password = bcrypt.hashSync(password, 10);
    await newUser.save();
    const result = await User.findOne({ username });
    console.log(result);//This is for testing purposes only, Delete line before pushing.
    const user = (({ email, username, bio, image }) => ({ email, username, bio, image }))(result);
    res.status(201).json({ user })
}





