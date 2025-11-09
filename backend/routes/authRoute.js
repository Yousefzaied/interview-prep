

const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController.js");
const { protect } = require("../middlewares/authMidleware.js");
const upload = require("../middlewares/multer.js"); 

const router = express.Router();

// auth routes
router.post("/register", upload.single("profileImage"), registerUser); 
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
