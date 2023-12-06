const express = require('express');
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  likedBlog,
  dislikedBlog,
  uploadImages,
} = require("../controllers/blogCtrl");
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');

const router = express.Router()


router.post('/', authMiddleware, isAdmin, createBlog)
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  uploadImages
);
router.put("/likes", authMiddleware, likedBlog);
router.put("/dislikes", authMiddleware, dislikedBlog);

router.put("/:id", authMiddleware, isAdmin , updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);



module.exports = router;