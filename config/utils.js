/*******************************************************************
 *      This file has a lot of usefull functions for the app       *
 *******************************************************************/
const { User } = require('../models');
const jwt = require('jsonwebtoken');


/********************************************************
 *                 BCRYPT HASH AND VERIFY           *
 ********************************************************/
const bcrypt = require('bcrypt');
module.exports.hashPassword = async (User, password) => {
    User.salt = await bcrypt.genSalt(10)
    User.password = await bcrypt.hash(password, User.salt);
    return User
}

module.exports.verifyPassword = async (User, password) => {
    const match = await bcrypt.compare(password, User.password);
    if (match) {
        return console.log('it matches you dont need the salt bruv')
    }
    console.log('no match bro')
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