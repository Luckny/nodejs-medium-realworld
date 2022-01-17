const { User } = require('../models'); //The User model.
const utils = require('../config/utils'); //Hashing library.
const { StatusCodes } = require('http-status-codes');

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
      .json({ profile: profile.toProfileJson({ isFollowing }) });
};

/**
 * This function adds a profile to the current user's following list
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
   const loggedInUser = await User.findById(id);
   //if a user tries to follow himself, just send his own profile back
   //with following set to true
   if (loggedInUser._id.equals(profile._id))
      return res
         .status(StatusCodes.OK)
         .json({ profile: profile.toProfileJson({ isFollowing: true }) });
   loggedInUser.follow(profile._id);
   await loggedInUser.save();
   return res
      .status(StatusCodes.OK)
      .json({ profile: profile.toProfileJson({ isFollowing: true }) });
};

/**
 * This function removes a profile from the current user's following list
 */
module.exports.unfollow = async (req, res) => {
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

   //Find the logged in user
   const loggedInUser = await User.findById(id);
   //if a user tries to unfollow himself, just send his own profile back
   //with following set to true
   if (loggedInUser._id.equals(profile._id))
      return res
         .status(StatusCodes.OK)
         .json({ profile: profile.toProfileJson({ isFollowing: true }) });

   //unfollow the profile
   loggedInUser.unfollow(profile._id);
   loggedInUser.save();
   return res
      .status(StatusCodes.OK)
      .json({ profile: profile.toProfileJson({ isFollowing: false }) });
};
