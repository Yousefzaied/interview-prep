

const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary.js");

// generate jwt token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//  REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let profileImageUrl = "";

    // check if user exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // handle image upload (if exists)
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
      });
      profileImageUrl = uploadResult.secure_url;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    // return user data
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//  LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // send success response
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  GET USER PROFILE (Protected Route)
const getUserProfile = async (req, res) => {
    try {
        // req.user is added by middleware after verifying token
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };
