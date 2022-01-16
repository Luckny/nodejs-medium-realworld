const { User } = require('../models'); //The User model.
const utils = require('../config/utils'); //Hashing library.
const {
   ReasonPhrases,
   StatusCodes,
   getReasonPhrase,
   getStatusCode,
} = require('http-status-codes');
const { findByIdAndUpdate, findById } = require('../models/users');

/**
 * This function fetches a user profile if it exists using the
 * username recieved from the parameters
 */
module.exports.getProfile = async (req, res) => {
   const { username } = req.params;
   //the user beeing searched for
   const profile = await User.findOne({ username });
   if (!profile) {
      return res
         .status(StatusCodes.NOT_FOUND)
         .json(utils.makeJsonError('User Profile Not Found!'));
   }
   //default value for following
   let isFollowing = false;
   //if there is a logged in user
   if (req.payload) {
      //find him
      const { id } = req.payload;
      const loggedInUser = await User.findById(id);

      //if the logged in user is following the profile return true
      //or if the logged in user searched for his own profile
      if (
         loggedInUser.isFollowing(profile._id) |
         loggedInUser._id.equals(profile._id)
      )
         isFollowing = true;
   }
   return res
      .status(StatusCodes.OK)
      .json(profile.toProfileJson({ isFollowing }));
};

/**
 * This function adds a profile to the current users following list
 */
module.exports.follow = async (req, res) => {
   const {
      params: { username },
      payload: { id },
   } = req;

   //Find the profile with the username
   const profile = await User.findOne({ username });
   //If profile is not in DB
   if (!profile) {
      return res
         .status(StatusCodes.NOT_FOUND)
         .json(utils.makeJsonError('User Profile Not Found!'));
   }
   //find the current user
   const currentUser = await User.findById(id);
   //if a user tries to follow himself, just send his own profile back
   //with following set to true
   if (currentUser._id.equals(profile._id))
      return res
         .status(StatusCodes.OK)
         .json(profile.toProfileJson({ isFollowing: true }));
   const { followError, followErrorMessage } = currentUser.follow(profile._id);
   //If current user is already following the profile
   if (followError) {
      return res
         .status(StatusCodes.UNAUTHORIZED)
         .json(utils.makeJsonError(followErrorMessage));
   }
   //else
   await currentUser.save();
   return res
      .status(StatusCodes.OK)
      .json(profile.toProfileJson({ isFollowing: true }));
};
