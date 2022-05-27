/*******************************************************************
 *      This File Defines and exports the ARTICLE Schema which is
 *      defined using the mongoose docs.
 *******************************************************************/
const mongoose = require("mongoose");
const randomCharacters = require("unique-slug");
const makeSlug = require("slug");
const Tag = require("./tags");
const Schema = mongoose.Schema;
//i need the user schema for author operations
const User = require("./users");

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
      default: "",
    },
    body: {
      type: String,
      default: "",
    },
    tagList: [String],
    favoritesCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

/**
 * Before saving a new document:
 *  make a slug for the title
 *  if it has new unknown tags, create them
 */
articleSchema.pre("save", async function (next) {
  const article = this;
  //if the title was modified, make a new slug
  if (article.isModified("title")) {
    article.slug = makeSlug(`${article.title} ${randomCharacters()}`);
  }

  if (article.isModified("tagList")) {
    const allTags = await Tag.find();
    for (let tag of article.tagList) {
      let foundTag = allTags.find((item) => item.name === tag);
      if (!foundTag) {
        let newTag = new Tag({ name: tag });
        await newTag.save();
      }
    }
  }

  next();
});

/**
 * returns a representation of the article with a populated author field
 * @param {User} currentUser the current logged in user
 * @param {User} author the author of the article
 * @returns a representation of the article
 */
articleSchema.methods.toAPIJson = async function (currentUser) {
  const { author } = await this.populate("author");
  const { _id: authorId, username, bio, image } = author;
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    tagList: this.tagList,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favorited: currentUser ? currentUser.favorites.includes(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: {
      username,
      bio,
      image,
      following: (currentUser && currentUser.isFollowing(authorId)) || false,
    },
  };
};

//adds one to the favorites count
articleSchema.methods.incrementFavoritesCount = function () {
  this.favoritesCount++;
  this.save();
};

//removes one from the favorites count
articleSchema.methods.decrementFavoritesCount = function () {
  this.favoritesCount > 0 ? this.favoritesCount-- : (this.favoritesCount = 0);
  this.save();
};

/**
 * This function returns true if the recieved user is the author of this article
 */
articleSchema.methods.isAuthor = async function (user) {
  return user._id.equals(this.author);
};

articleSchema.methods.deleteComment = async function (commentId) {
  const article = this;
  if (!article.comments.includes(commentId)) return null;

  article.comments.remove(commentId);
  return article.save();
};

//removing the article from the user fav list after deletion
articleSchema.post("findOneAndDelete", async (article) => {
  const users = await User.find({ favorites: article });
  users.map(async (user) => {
    user.favorites.remove(article);
    await user.save();
  });
});

//Creating the Article model
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
