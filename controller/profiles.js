const { User } = require('../models'); //The User model.
const utils = require('../config/utils'); //Hashing library.
const {
   ReasonPhrases,
   StatusCodes,
   getReasonPhrase,
   getStatusCode,
} = require('http-status-codes');

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
   return res.status(StatusCodes.OK).json(profile.toProfileJson(isFollowing));
};
