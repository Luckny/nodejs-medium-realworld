/*******************************************************************
 *      This file has a lot of usefull functions for the app       *
 *******************************************************************/
const { User } = require('../models');
const jwt = require('jsonwebtoken');


/********************************************************
 *                 BCRYPT ENCRYPT AND DECRYPT           *
 ********************************************************/
const bcrypt = require('bcrypt');
module.exports.hashPassword = async (User, password) => {
    User.salt = await bcrypt.genSalt(10)
    User.password = await bcrypt.hash(password, User.salt);
    return User
}


/*********************************
 *         GENERATE JWT          *
 *********************************/
module.exports.genToken = (User) => {
    return jwt.sign({ _id: User.id, username: User.username }, process.env.JWT_SECRET)
}