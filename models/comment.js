/*******************************************************************
 *      This File Defines and exports the COMMENT Schema which is 
 *      defined using the mongoose docs.
 *******************************************************************/
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

//Creating the Comment model.
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;