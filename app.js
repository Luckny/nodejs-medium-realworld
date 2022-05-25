process.on("warning", (e) => console.warn(e.stack));
require("dotenv").config(); //to use .env variables
const { userRoutes, profileRoutes, articleRoutes, commentRoutes } = require("./routes");
const tagCtrl = require("./controller/tags");
const express = require("express");
const mongoose = require("./config/mongoose"); //Contains the mongoose configuration
const { urlencoded } = require("express");
const { utils } = require("./config/utils");
const { StatusCodes } = require("http-status-codes");
const app = express();

/******************************
 *  APPLICATION MIDDLEWARES   *
 ******************************/
app.use(urlencoded({ extended: true }));
app.use(express.json());
//End MiddleWares.

/**
 * This function uses the mongoose config in the loaders/index to
 * Start the mongoose connection and then sets the listening port
 * for the express application.
 */
async function startServer(port) {
  await mongoose.connectDb();

  app.listen(port, () => {
    console.log("Serving on port 3000");
  });
}

/******************************
 *          ROUTES            *
 ******************************/
app.use("/", userRoutes);
app.use("/profiles", profileRoutes);
app.use("/articles", articleRoutes);
app.use("/articles", commentRoutes);
app.use("/tags", tagCtrl.getAll);

//Error handler
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(err.status).json(utils.makeJsonError(err.message));
  }
  return res
    .status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(utils.makeJsonError(err.message));
});

//Starts the Server
startServer(3000);
