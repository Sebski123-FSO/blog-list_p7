const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "test blog 1",
    author: "sebski123",
    url: "example.com",
    likes: 69,
  },
  {
    title: "test blog 2",
    author: "nightfly13",
    url: "example.com/2",
    likes: 420,
  },
  {
    title: "test blog 3",
    author: "chatayne",
    url: "example.com/3",
    likes: 8008,
  },
];

const initialUsers = [
  {
    name: "test1",
    userName: "user1",
    password: "1234",
  },
  {
    name: "test2",
    userName: "user2",
    password: "4321",
  },
  {
    name: "test3",
    userName: "user3",
    password: "12344321",
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
};
