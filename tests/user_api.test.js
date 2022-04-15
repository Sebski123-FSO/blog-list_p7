const User = require("../models/user");
const app = require("../app");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const mongoose = require("mongoose");
const supertest = require("supertest");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  for (const user of helper.initialUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const newUser = new User({ userName: user.userName, password: passwordHash, name: user.name });

    await newUser.save();
  }
});

describe("reading users", () => {
  test("getting all users works", async () => {
    const users = await helper.usersInDb();

    expect(users.length).toBe(helper.initialUsers.length);
  });
});

describe("adding a new user", () => {
  test("adding valid user works correctly", async () => {
    const newUser = {
      name: "test1",
      userName: "test",
      password: "1234",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const users = await helper.usersInDb();

    expect(users.length).toBe(helper.initialUsers.length + 1);
  });

  test("adding invalid user doesn't work", async () => {
    const newUser = {
      name: "test1",
      userName: "test",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const users = await helper.usersInDb();

    expect(users.length).toBe(helper.initialUsers.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
