const dummy = () => 1;

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return (sum += blog.likes);
  };
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const mostLiked = blogs.reduce((previousValue, currentValue) => {
    return previousValue.likes > currentValue.likes ? previousValue : currentValue;
  });

  delete mostLiked._id;
  delete mostLiked.__v;
  delete mostLiked.url;

  return mostLiked;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  let authorBlogs = blogs.reduce((op, { author }) => {
    op[author] = op[author] || 0;
    op[author]++;
    return op;
  }, {});

  let mostBlogs = Object.keys(authorBlogs).sort((a, b) => authorBlogs[b] - authorBlogs[a])[0];

  return { author: mostBlogs, blogs: authorBlogs[mostBlogs] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  let authorLikes = blogs.reduce((op, { author, likes }) => {
    op[author] = op[author] || 0;
    op[author] += likes;
    return op;
  }, {});

  let mostLikes = Object.keys(authorLikes).sort((a, b) => authorLikes[b] - authorLikes[a])[0];

  return { author: mostLikes, likes: authorLikes[mostLikes] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
