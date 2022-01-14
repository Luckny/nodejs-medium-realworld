const utils = require('../config/utils');
/*******************************************************************
 *      This File Defines and exports the User Schema which is
 *      defined using the mongoose docs.
 *******************************************************************/
const mongoose = require('mongoose');
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
      default: '',
   },

   image: {
      type: String,
      default: '',
   },
   favorites: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Article',
      },
   ],
   following: [
      {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
   ],
});

userSchema.pre('save', async function (next) {
   const user = this;
   const hash = await utils.hashPassword(this.password);
   this.password = hash;
   next();
});

//Creating the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
