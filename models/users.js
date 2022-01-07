const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    user: {
        username: {
            type: String,
        },
        token: {
            type: String,
        },

        email: {
            type: String,
        },
        bio: {
            type: String,
            default: 'No Bio.'
        },

        image: {
            type: String,
            default: null
        }
    }
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;