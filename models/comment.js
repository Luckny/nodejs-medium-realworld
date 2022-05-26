/*******************************************************************
 *      This File Defines and exports the COMMENT Schema which is
 *      defined using the mongoose docs.
 *******************************************************************/
const mongoose = require("mongoose");
const Article = require("./articles");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Before saving a comment:
 *  find the article to which it belongs and update it
 */
commentSchema.pre("save", async function (next) {
  const comment = this;
  try {
    await Article.findByIdAndUpdate(comment.article, {
      $push: { comments: comment },
    });
    next();
  } catch (e) {
    next(e);
  }
});

/**
 * Returns true if the user recieved as parameter is the author of this article.
 * @param {User} currentUser
 * @returns
 */
commentSchema.methods.isAuthor = function (currentUser) {
  return currentUser._id.equals(this.author);
};

commentSchema.methods.toAPIJson = async function (currentUser) {
  const comment = this;
  const {
    author: { _id, username, bio, image },
  } = await comment.populate("author");

  return {
    id: comment._id,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    body: comment.body,
    author: {
      username,
      bio,
      image,
      following: (currentUser && currentUser.isFollowing(_id)) || false,
    },
  };
};
//Creating the Comment model.
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
