import User from "../models/UserModel.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToImageKit } from "../middleware/imageKitMiddleware.js";

// Create User
export const createUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log(
      "Request File:",
      req.file
        ? {
            name: req.file.originalname,
            size: req.file.size,
            type: req.file.mimetype,
          }
        : "No file uploaded"
    );

    let profileImageUrl = "";

    // Haddii uu sawir jiro, upload garee
    if (req.file) {
      const imageData = await uploadToImageKit(req.file).catch((error) => {
        console.error("Upload Failed:", error);
        throw new Error("Image upload failed: " + error.message);
      });

      profileImageUrl = imageData.url;
    }

    // HASH garee password-ka ka hor intaadan DB gelin
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Samee user cusub
    const newUser = new User({
      ...req.body,
      password: hashedPassword, // hashed password
      profileImage: profileImageUrl, // Waa faaruq haddii sawir la’aan
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({
      message: "User creation failed",
      error: error.message,
    });
  }
};
// Get All Users (Admin Only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Qalad helista isticmaalayaasha" });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const users = await User.findById(req.params.id).select("-password");
    if (!users)
      return res.status(404).json({ message: "Isticmaale lama helin" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Qalad helista isticmaale" });
  }
};

// GET /api/users/search?query=someName

export const searchCustomers = async (req, res) => {
  console.log("Received query:", req.query.query);
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: "Query waa waajib" });
    }

    const customers = await User.find({
      role: "customer",
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    if (customers.length === 0) {
      return res.status(404).json({ message: "Ma jiro macaamiil la helay" });
    }

    return res.status(200).json(customers);
  } catch (error) {
    console.error(
      "❌ Qalad helista isticmaalaha:",
      error.stack || error.message
    );
    return res
      .status(500)
      .json({ message: "Qalad helista isticmaale", error: error.message });
  }
};
export const searchMarketers = async (req, res) => {
  console.log("Received query:", req.query.query);
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: "Query waa waajib" });
    }

    const marketers = await User.find({
      role: "marketer",
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    if (marketers.length === 0) {
      return res.status(404).json({ message: "Ma jiro suuqgeeye la helay" });
    }

    return res.status(200).json(marketers);
  } catch (error) {
    console.error("❌ Qalad helista suuqgeye:", error.stack || error.message);
    return res
      .status(500)
      .json({ message: "Qalad helista suuqgeye", error: error.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { username, email, role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Isticmaale lama helin" });

    // Update fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    // Handle profile image if uploaded
    if (req.file) {
      const imageData = await uploadToImageKit(req.file).catch((error) => {
        console.error("Image Upload Failed:", error);
        throw new Error("Image upload failed: " + error.message);
      });
      user.profileImage = imageData.url;
    }

    await user.save();

    res.json({
      message: "Isticmaale si guul leh ayaa loo cusboonaysiiyay",
      user,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({
      message: "Qalad ayaa dhacay intii la cusboonaysiinayay",
      error: error.message,
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Isticmaale lama helin" });
    res.json({ message: "Isticmaale si guul leh ayaa loo tirtiray" });
  } catch (error) {
    res.status(500).json({ message: "Qalad tirtirida" });
  }
};

// Update Profile Image
export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "Isticmaale lama helin" });

    if (req.file) {
      // Upload image to ImageKit
      const imageData = await uploadToImageKit(req.file);
      user.profileImage = imageData.url;
    }

    await user.save();
    res.json({
      message: "Sawirka si guul leh ayaa loo cusboonaysiiyay",
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Qalad kaydinta sawirka" });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userId = req.user._id; // Ka helay `authMiddleware`
    console.log("Received user ID:", userId);

    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "Isticmaale lama helin" });
    }

    console.log("User found:", user.username);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log("Password match status:", isMatch);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Password-ka hada jira waa khalad" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: "Password-ka si guul leh ayaa loo beddelay" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Qalad bedelka password-ka" });
  }
};

