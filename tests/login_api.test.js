const User = require("../models/user");
const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await api.post("/api/users").send({ userName: "test", name: "test", password: "1234" });
});

describe("user login", () => {
  test("login with invalid data fails", async () => {
    const invalidUserLogin = {
      userName: "test2",
      password: "4321",
    };

    const response = await api.post("/api/login").send(invalidUserLogin).expect(400);
    expect(response.text.token).not.toBeDefined();
  });
  test("login with valid data succedes", async () => {
    const validUserLogin = {
      userName: "test",
      password: "1234",
    };

    const response = await api
      .post("/api/login")
      .send(validUserLogin)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.token).toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
