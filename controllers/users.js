const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { url: 1, title: 1, author: 1 });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { userName, name, password } = request.body;

  if (!(userName && password && name)) {
    return response.status(400).json({
      error: "'userName', 'password' and 'name' required",
    });
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 charecters long",
    });
  }

  const existingUser = await User.findOne({ userName });

  if (existingUser) {
    return response.status(400).json({
      error: `user with userName ${userName} already exists`,
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    userName,
    name,
    password: passwordHash,
  };

  const user = new User(newUser);
  const result = await user.save();
  response.status(201).json(result);
});

module.exports = usersRouter;
