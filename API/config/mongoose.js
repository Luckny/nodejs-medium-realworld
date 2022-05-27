const mongoose = require("mongoose");
const dbURI = process.env.DB_URI;

//MongoDB options
const options = { useNewUrlParser: true, useUnifiedTopology: true };

//The Database connection
module.exports.connectDb = async () => {
  await mongoose.connect(dbURI, options);
  console.log("MongoDB connected!");
};
