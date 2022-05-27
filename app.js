process.on("warning", (e) => console.warn(e.stack)); // for debugging purposes
require("dotenv").config();
const express = require("express");
const mongoose = require("./API/config/mongoose"); //Contains the mongoose configuration
const utils = require("./API/lib/utils");
const { StatusCodes } = require("http-status-codes");
const app = express();

/******************************
 *  APPLICATION MIDDLEWARES   *
 ******************************/
app.use(express.urlencoded({ extended: true }));
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
const {
  userRoutes,
  profileRoutes,
  articleRoutes,
  commentRoutes,
} = require("./API/routes");
const tagCtrl = require("./API/controller/tags");
const wrapAsync = require("./API/lib/wrapAsync");
app.use("/", userRoutes);
app.use("/profiles", profileRoutes);
app.use("/articles", articleRoutes);
app.use("/articles", commentRoutes);
app.use("/tags", wrapAsync(tagCtrl.getAll));

//Error handler
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "UnauthorizedError") {
    return res.status(err.status).json(utils.makeJsonError(err.message));
  }

  if (!err.status) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    err.message = "Internal server error.";
  }
  return res.status(err.status).json(utils.makeJsonError(err.message));
});

//Starts the Server
startServer(process.env.SERVER_PORT);
