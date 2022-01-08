const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    token: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: ''
    },

    image: {
        type: String,
        default: null
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]

})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;