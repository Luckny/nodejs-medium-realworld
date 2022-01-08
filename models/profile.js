const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    image: {
        type: String
    },

    following: {
        type: Boolean,
        default: false
    }
})

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;