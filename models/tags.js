/*******************************************************************
 *      This File Defines and exports the TAGS Schema which is 
 *      defined using the mongoose docs.
 *******************************************************************/
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

//Creating the Tag model
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;