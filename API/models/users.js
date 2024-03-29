const bcrypt = require("bcrypt");
const utils = require("../lib/utils");
/*******************************************************************
 *      This File Defines and exports the User Schema which is
 *      defined using the mongoose docs.
 *******************************************************************/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    default: "",
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

/**
 * This function hashes a the user password before saving
 */
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const hash = await bcrypt.hash(user.password, 10);

  this.password = hash;
  next();
});

/**
 * This function verifies if the recieved password is a valid one
 */
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * This function verifies if the user id recieved is part of this user's
 * following array
 */
userSchema.methods.isFollowing = function (anothorUserId) {
  const user = this;
  return user.following.includes(anothorUserId);
};

/**
 * This function adds the recieved user to this user's following array
 */
userSchema.methods.follow = function (anothorUserId) {
  const user = this;
  if (this.isFollowing(anothorUserId)) {
    return;
  }

  user.following.push(anothorUserId);
  return this.save();
};

/**
 * This function removes the recieved user from this user's following array
 */
userSchema.methods.unfollow = function (anothorUserId) {
  const user = this;
  if (!user._id.equals(anothorUserId)) user.following.remove(anothorUserId);
  return user.save();
};

/**
 * This function renders a user object with only the usefull
 * information for the api
 */
userSchema.methods.toUserJson = function () {
  return {
    user: {
      email: this.email,
      token: utils.genToken(this),
      username: this.username,
      bio: this.bio,
      image: this.image,
    },
  };
};

/**
 * This function renders a profile object
 */
userSchema.methods.toProfileJson = function (isFollowing) {
  return {
    username: this.username,
    bio: this.bio,
    image: this.image,
    following: isFollowing,
  };
};

/**
 * This function adds the recieved article to the favorites
 */
userSchema.methods.addToFavorites = async function (article) {
  const user = this;
  const { _id: articleId } = article;
  //if already favorited, do nothing
  if (user.favorites.includes(articleId)) return;

  //add the article in the favorites array
  user.favorites.push(articleId);
  //+1 to the article's favorites count
  await article.incrementFavoritesCount();
  return user.save();
};

/**
 * This function removes the recieved article from the favorites
 */
userSchema.methods.removeFromFavorites = async function (article) {
  const user = this;
  const { _id: articleId } = article;

  //if alreary not favorited, do nothing
  if (!user.favorites.includes(articleId)) return;

  //remove the article from the favs
  user.favorites.remove(articleId);
  //-1 to the article's favorites count
  await article.decrementFavoritesCount();
  return user.save();
};

//Creating the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
