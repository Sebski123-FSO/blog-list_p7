const User = require("../models/user");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

const tokenExtractor = (req, res, next) => {
  let auth = req.get("Authorization");
  if (!auth) {
    auth = req.get("authorization");
  }
  // auth = "";

  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const authToken = auth.substring(7);
    req.token = authToken;
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;

  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    req.user = user;
  }
  next();
};

const errorLogger = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { errorLogger, tokenExtractor, userExtractor };
