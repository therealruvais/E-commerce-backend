const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getaBrand,
  getAllBrand,
} = require("../controllers/brandCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", getaBrand);
router.get("/", getAllBrand);

module.exports = router;
