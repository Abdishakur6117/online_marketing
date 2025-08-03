import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfileImage,
  changePassword,
  searchCustomers,
  searchMarketers,
} from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { uploadMiddlewareUser } from "../middleware/imageKitMiddleware.js";

const router = express.Router(); // ✅ Ku dhex saar INITIALIZATION-kan KA HOR router-ka!



// GET /api/users (Get All Users)

// GET /api/users/:id (Get User by ID)
// GET /api/users?role=customer
// route: /api/users?role=customer
// router.get("/search", searchCustomers);

router.get("/api/users/search", searchCustomers);
router.get("/api/users/marketers/search", authMiddleware, searchMarketers);

router.put(
  "/api/users/:id/change-password",
  authMiddleware, // ✅ Hubin token & user
  changePassword // ✅ Ogol user kasta inuu iskiis u beddelo
);

router.get("/api/users/:id", authMiddleware, getUserById);
router.get("/api/users/", authMiddleware, adminMiddleware, getAllUsers);

// POST /api/users (Create User with Image Upload)
router.post(
  "/api/users/",
  authMiddleware,
  adminMiddleware,
  uploadMiddlewareUser, // Just use the middleware (no .single() here)
  createUser
);

// PUT /api/users/:id (Update User)
// router.put("/:id", authMiddleware, adminMiddleware, updateUser);
// ✅ Sax: PUT /api/users/:id (Update User with optional image)
router.put(
  "/api/users/:id",
  authMiddleware,
  adminMiddleware,
  uploadMiddlewareUser, // ✅ ADD THIS to parse multipart/form-data
  updateUser
);


// DELETE /api/users/:id (Delete User)
router.delete("/api/users/:id", authMiddleware, adminMiddleware, deleteUser);

// PUT /api/users/:id/profile-image (Update Profile Image)
router.put(
  "/api/users/:id/profile-image",
  authMiddleware,
  uploadMiddlewareUser, // ✅ Multer middleware (halkii .single("image"))
  updateProfileImage
);

// PUT :id/change-password (Change Password)
// router.put("/api/users/:id/change-password", changePassword);
// router.put("/api/users/change-password", authMiddleware, changePassword);

export default router;
