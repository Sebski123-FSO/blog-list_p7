const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { userName: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const user = request.user;

  if (!user) {
    return response.status(401).json({
      error: "invalid token",
    });
  }
  const blog = new Blog({ ...request.body, user: user.id });
  const result = await blog.save();

  user.blogs.push(blog._id);
  user.save();
  response.status(201).json(result);
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true, runValidators: true, context: "query" });

  response.json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const user = request.user;

  if (!user) {
    return response.status(401).json({
      error: "invalid token",
    });
  }

  if (!user.blogs.includes(id)) {
    const blog = await Blog.findById(id);
    if (blog) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    } else {
      return response.status(204).end();
    }
  }

  await Blog.findByIdAndDelete(id);

  response.status(204).end();
});

module.exports = blogsRouter;
