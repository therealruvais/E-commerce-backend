const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const validateMongodbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

const createBlog = async (req, res) => {
  const newBlog = await Blog.create(req.body);
  res.json({ status: "success", newBlog });
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const updateB = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({ updateB });
};
const getBlog = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const getB = await Blog.findById(id).populate("likes").populate("dislikes");
  await Blog.findByIdAndUpdate(
    id,
    {
      $inc: { numViews: 1 },
    },
    {
      new: true,
    }
  );
  res.json({ getB });
};

const getAllBlog = async (req, res) => {
  const getBlog = await Blog.find();
  res.json(getBlog);
};
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const delBlog = await Blog.findByIdAndDelete(id);
  res.json(delBlog);
};

const likedBlog = async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const loginUserId = req?.user?._id;

    const isLiked = blog?.isLiked;

    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyDisliked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );

      return res.json(updatedBlog);
    }

    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyLiked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );

      return res.json(updatedBlog);
    } else {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );

      return res.json(updatedBlog);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const dislikedBlog = async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isDisLiked = blog?.isDisliked;
  // find if the user has disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
};

const uploadImages = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const uploader = (path) => cloudinaryUploadImg(path, "images");
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath);
    fs.unlinkSync(path);
  }
  const findBlog = await Blog.findByIdAndUpdate(
    id,
    {
      images: urls.map((file) => {
        return file;
      }),
    },
    { new: true }
  );
  res.json(findBlog);
};

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  likedBlog,
  dislikedBlog,
  uploadImages,
};
