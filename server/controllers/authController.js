import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToImageKit } from "../middleware/imageKitMiddleware.js";
// User Registration
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Fadlan buuxi dhammaan fields-ka" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Emailkan hore ayaa loo isticmaalay" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileImage = "";
    if (req.file) {
      const imageData = await uploadToImageKit(req.file);
      profileImage = imageData.url;
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "customer",
      profileImage,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Akoonka si guul leh ayaa loo sameeyay",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Qalad server ah", error: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Fadlan geli emailka iyo password-ka" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email ama password khalad ah" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ama password khalad ah" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Akoonkan waa la disable gareeyay" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // https only in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      lastLogin: user.lastLogin,
    };

    res.status(200).json({
      message: "Si guul leh ayaad u gashay",
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Qalad server ah", error: error.message });
  }
};
// Get Current User Profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Isticmaale lama helin" });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.profileImage, // <== IMPORTANT
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Qalad server ah" });
  }
};

// Logout (Client-side - just delete token)
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",
    path: "/",
  });
  res.status(200).json({ message: "Si guul leh ayaad uga baxday" });
};
