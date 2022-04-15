const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();

loginRouter.post("/", async (req, res) => {
  const { userName, password } = req.body;

  if (!(userName && password)) {
    return res.status(400).json({
      error: "missing userName or password",
    });
  }

  const user = await User.findOne({ userName });

  if (!user) {
    return res.status(400).json({
      error: `user with userName ${userName} does not exist`,
    });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({
      error: "wrong username or password",
    });
  }

  const userForToken = {
    userName: user.userName,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  res.json({
    token,
    userName: user.userName,
    name: user.name,
    id: user._id,
  });
});

module.exports = loginRouter;
