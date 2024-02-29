const Product = require("../models/productModel");
const User = require("../models/userModel");
const slugify = require("slugify");
const validateMongodbId = require("../utils/validateMongodbId");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");

const createProduct = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json({ newProduct });
  } catch (err) {
    throw new Error(err);
  }
};

const updateaProduct = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
};
const deleteaProduct = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
};

const getaProduct = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);

    const findaProduct = await Product.findById(id);
    res.json({ findaProduct });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    //filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|eq)\b/g,
      (match) => `$${match}`
    );

    let query = Product.find(JSON.parse(queryStr));

    //sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    //limiting the fields
    if (req.query.fields) {
      const fieldsBy = req.query.fields.split(",").join(" ");
      query = query.select(fieldsBy);
    } else {
      query = query.select("-__v");
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("this page does not exists");
    }
    const product = await query;
    res.json({ product });
  } catch (error) {
    throw new Error(error);
  }
};

const addToWhishlist = async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  const user = await User.findById(_id);
  const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
  if (alreadyAdded) {
    let user = await User.findByIdAndUpdate(
      _id,
      { $pull: { wishlist: prodId } },
      { new: true }
    );
    res.json(user);
  } else {
    let user = await User.findByIdAndUpdate(
      _id,
      { $push: { wishlist: prodId } },
      { new: true }
    );
    res.json(user);
  }
};

const rating = async (req, res) => {
  const { _id } = req.user;
  const { star, comment, prodId } = req.body;
  const product = await Product.findById(prodId);
  let alreadyRated = product.ratings.find(
    (userId) => userId.postedby.toString() === _id.toString()
  );
  if (alreadyRated) {
    const updateRating = await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRated },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else {
    const ratedProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        $push: {
          ratings: {
            star: star,
            comment: comment,
            postedby: _id,
          },
        },
      },
      { new: true }
    );
  }
  const getallratings = await Product.findById(prodId);
  let totalRating = getallratings.ratings.length;
  let ratingsum = getallratings.ratings
    .map((item) => item.star)
    .reduce((prev, curr) => prev + curr, 0);
  let actualRating = Math.round(ratingsum / totalRating);
  let finalproduct = await Product.findByIdAndUpdate(
    prodId,
    {
      totalrating: actualRating,
    },
    { new: true }
  );
  res.json(finalproduct);
};

const uploadImages = async (req, res) => {
  const uploader = (path) => cloudinaryUploadImg(path, "images");
  const urls = [];
  const files = req.files;

  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath);
    fs.unlinkSync(path);
  }
  const images = urls.map((file) => {
    return file;
  });
  res.json(images);
};

const deleteImage = async (req, res) => {
  const { id } = req.params;
  const deleted =  cloudinaryDeleteImg(id, "images");
  res.json({ msg: "deleted" });
};

module.exports = {
  createProduct,
  getaProduct,
  getAllProducts,
  updateaProduct,
  deleteaProduct,
  addToWhishlist,
  rating,
  uploadImages,
  deleteImage,
};
