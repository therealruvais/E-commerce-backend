const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProducts,
  updateaProduct,
  deleteaProduct,
  addToWhishlist,
  rating,
  uploadImages,
  deleteImage,
} = require("../controllers/productCtrl");

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);
router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware , addToWhishlist);
router.put("/rating", authMiddleware, rating);
router.get("/", getAllProducts);
router.put("/:id", authMiddleware, isAdmin, updateaProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteaProduct);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteImage);

module.exports = router;
