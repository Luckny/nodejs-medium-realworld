const Tag = require("../models/tags");
const { StatusCodes } = require("http-status-codes");
const { utils } = require("../config/utils");
module.exports.getAll = async (req, res) => {
  try {
    const tags = await Tag.find();
    if (!tags || tags.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json(utils.makeJsonError("no tags found"));
    }
    return res.status(StatusCodes.OK).json({ tags: tags });
  } catch (e) {
    console.log(e);
  }
};
