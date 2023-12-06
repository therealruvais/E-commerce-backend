const express = require("express");
const {
  createUser,
  Login,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logOut,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/password-reset/:token", resetPassword);

router.put("/password",authMiddleware, updatePassword);
router.post("/login", Login);
router.get("/users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get('/logout' , logOut)
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", deleteUser);
router.patch("/edit-user", authMiddleware, updateUser);
router.patch("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.patch("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
