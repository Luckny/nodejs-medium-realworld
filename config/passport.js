/**************************************************************************
 *          THIS FILE HAS THE PASSPORT STRATEGIES CONFIGURATIONS          *
 **************************************************************************/
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models')
const jwt = require('jsonwebtoken')


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_SECRET
}

const strategy = new JwtStrategy(opts, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
})


passport.use(strategy)




