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
  AdminLogin,
  getWishlist,
  saveAddress,
  userCart,
  getCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/password-reset/:token", resetPassword);
router.patch("/order-status/:id",authMiddleware, isAdmin, updateOrderStatus);

router.put("/password",authMiddleware, updatePassword);
router.post("/login", Login);
router.post("/admin-login", AdminLogin);
router.post("/cart",authMiddleware, userCart);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);

router.get("/users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get('/logout' , logOut)
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getCart);
router.get("/get-order", authMiddleware, getOrders);

router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/empty-cart", authMiddleware,emptyCart);
router.delete("/:id", deleteUser);

router.patch("/edit-user", authMiddleware, updateUser);
router.patch("/save-address", authMiddleware, saveAddress);
router.patch("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.patch("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
