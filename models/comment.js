const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;