const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", {
      userName: 1,
      name: 1,
    })
    .populate("comments", {
      content: 1,
    });
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

blogsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id, {})
    .populate("user", {
      userName: 1,
      name: 1,
    })
    .populate("comments", {
      content: 1,
    });
  response.json(blog);
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true, runValidators: true, context: "query" }
  );

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

blogsRouter.get("/:id/comments", async (request, response) => {
  const id = request.params.id;
  const comments = await Comment.find({ blog: id });
  response.json(comments);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).json({
      error: "Blog not found",
    });
  }

  const comment = new Comment({ ...request.body, blog: id });
  const result = await comment.save();

  blog.comments.push(comment._id);
  blog.save();

  response.status(201).json(result);
});

blogsRouter.get("/:blogId/comments/:id", async (request, response) => {
  const id = request.params.id;
  const blogId = request.params.blogId;
  const comment = await Comment.findById(id);
  if (!comment) {
    return response.status(404).json({
      error: "Comment not found",
    });
  }

  if (comment.blog.toString() !== blogId) {
    return response.status(404).json({
      error: `Comment not found on this blog, but you can see it on: ${comment.blog}`,
    });
  }

  response.json(comment);
});

module.exports = blogsRouter;
