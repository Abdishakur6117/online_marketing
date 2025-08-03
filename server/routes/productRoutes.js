import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from "../controllers/ProductController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { uploadMiddlewareProduct } from "../middleware/imageKitMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/my-products", authMiddleware, getMyProducts);
router.get("/:id", getProductById);

// Protected routes (Admin/Marketer)
router.post(
  "/",
  authMiddleware,
  uploadMiddlewareProduct, // Now supports multiple images
  createProduct
);

router.put("/:id", authMiddleware, uploadMiddlewareProduct, updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);

export default router;
