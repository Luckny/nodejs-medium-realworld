
const { User } = require('../models');//The User model.
const { encrypt, genToken } = require('../config/utils');//Hashing library.


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
        const newUser = await encrypt(new User({ username, email }), password);
        await newUser.save();
        const result = await User.findOne({ username, email });
        const token = genToken(result);
        const user = (({ email, username, bio, image }) => ({ email, username, bio, image }))(result);
        user.token = token;
        res.status(201).json({ user });
    } catch (e) {
        console.log(e)
        res.sendStatus(422)
    }


}





