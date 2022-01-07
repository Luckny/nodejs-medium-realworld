const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: { type: Date },
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;