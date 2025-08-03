import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignsByUser,
  getMarketerFullData,
} from "../controllers/CampaignController.js";
import { uploadMiddlewareCampaign } from "../middleware/imageKitMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create campaign with image upload
router.post(
  "/",
  authMiddleware,
  uploadMiddlewareCampaign, // Multer middleware
  createCampaign
);

// Get all campaigns
router.get("/all", getAllCampaigns);
router.get("/",protect, getCampaignsByUser);
// Get single campaign by ID
router.get("/:id", getCampaignById);
router.get("/marketer-full-data/:id", authMiddleware, getMarketerFullData);

// Update campaign
router.put("/:id", authMiddleware, uploadMiddlewareCampaign, updateCampaign);

// Delete campaign
router.delete("/:id", authMiddleware, deleteCampaign);

export default router;
