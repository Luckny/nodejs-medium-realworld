/*******************************************************************
 *      This file has a lot of usefull functions for the app       *
 *******************************************************************/
const { User } = require('../models');
const jwt = require('jsonwebtoken');


/********************************************************
 *                 BCRYPT HASH AND VERIFY           *
 ********************************************************/
const bcrypt = require('bcrypt');
module.exports.hashPassword = async (password) => {
    salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);

}

module.exports.verifyPassword = async (User, password) => {
    return await bcrypt.compare(password, User.password);
}


/*********************************
 *         GENERATE JWT          *
 *********************************/
module.exports.genToken = (User) => {
    const _id = User._id;
    const expiresIn = '1d';
    const payload = {
        sub: _id,
        iat: Date.now()
    };

    const signedToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });

    return {
        token: "Token " + signedToken,
        expires: expiresIn
    }
}