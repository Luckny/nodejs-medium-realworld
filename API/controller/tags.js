const Tag = require("../models/tags");
const { StatusCodes } = require("http-status-codes");
const { utils } = require("../lib/utils");
module.exports.getAll = async (req, res) => {
  const tags = await Tag.find();
  if (!tags || tags.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json(utils.makeJsonError("no tags found"));
  }

  const tagResponse = [];
  tags.forEach((tag) => {
    tagResponse.push(tag.name);
  });
  return res.status(StatusCodes.OK).json({ tags: tagResponse });
};
