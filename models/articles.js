/*******************************************************************
 *      This File Defines and exports the ARTICLE Schema which is
 *      defined using the mongoose docs.
 *******************************************************************/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema(
   {
      slug: {
         type: String,
         required: true,
         unique: true,
      },
      title: {
         type: String,
         required: true,
      },
      description: {
         type: String,
         default: '',
      },
      body: {
         type: String,
         default: '',
      },
      tagList: [String],
      favoritesCount: {
         type: Number,
         default: 0,
      },
      author: {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
      comments: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
         },
      ],
   },
   { timestamps: true }
);

/**
 * returns a representation of the article with a populated author field
 * @param {User} currentUser the current logged in user
 * @param {User} author the author of the article
 * @returns a representation of the article
 */
articleSchema.methods.toAPIJson = function (currentUser, author) {
   const { favorites } = currentUser;
   const { username, bio, image } = author;
   return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      tagList: this.tagList,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      favorited: favorites.includes(this._id),
      favoritesCount: this.favoritesCount,
      author: {
         username,
         bio,
         image,
         following: currentUser.isFollowing(author._id),
      },
   };
};

//Creating the Article model
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
