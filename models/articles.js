const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    body: {
        type: String,
        default: ''
    },
    tagList: [String],
    favoritesCount: {
        type: Number,
        default: 0
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]

}, { timestamps: true })

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
