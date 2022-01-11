const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models')
require('dotenv').config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

const strategy = new JwtStrategy(opts, (payload, done) => {
    User.findOne({ id: payload.sub }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false)
        }
    })
})

module.exports = strategy;

