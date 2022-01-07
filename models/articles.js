const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    slug: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tagList: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    favorited: {
        type: Boolean,
        default: false
    },
    favoritesCount: {
        type: Number,
        default: 0
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }

})

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
