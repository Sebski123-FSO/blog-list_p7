require("dotenv").config();
require("express-async-errors");
const {
  errorLogger,
  tokenExtractor,
  userExtractor,
} = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
const cors = require("cors");
const express = require("express");
const loginRouter = require("./controllers/login");
const mongoose = require("mongoose");
const usersRouter = require("./controllers/users");

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

app.use("/api/blogs", userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}
app.use(errorLogger);

module.exports = app;
