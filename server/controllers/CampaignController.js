import Campaign from "../models/CampaignModel.js";
import { uploadMiddlewareCampaign, uploadCampaignAssets } from '../middleware/imageKitMiddleware.js';
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";

// Create Campaign
export const createCampaign = async (req, res) => {
  try {
    const { title, description,targetAudience, startDate, endDate, budget, platform } =
      req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one campaign image is required" });
    }

    const newCampaign = new Campaign({
      title,
      description,
      targetAudience,
      startDate,
      endDate,
      budget,
      platform,
      createdBy: req.user.id,
      status: "Draft",
    });

    const uploadResults = await uploadCampaignAssets(files, newCampaign._id);
    newCampaign.images = uploadResults.map((result) => result.url);

    await newCampaign.save();

    res.status(201).json({
      message: "Campaign created successfully",
      campaign: newCampaign,
    });
  } catch (error) {
    console.error("Campaign creation error:", error);
    res.status(500).json({
      message: "Failed to create campaign",
      error: error.message,
    });
  }
};

// Get All Campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate(
      "createdBy",
      "username email"
    );
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Qalad helista ololaha" });
  }
};



export const getCampaignsByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Waxaa laga helaa auth middleware
    const campaigns = await Campaign.find({ createdBy: userId });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Qalad helista ololayaasha" });
  }
};

// Get Campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );
    if (!campaign)
      return res.status(404).json({ message: "Ololaha lama helin" });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Qalad helista ololaha" });
  }
};
// get full marketer
export const getMarketerFullData = async (req, res) => {
  try {
    const marketerId = req.params.id;

    // 1. Get marketer info (username, email, role)
    const marketer = await User.findById(marketerId).select("-password");
    if (!marketer) {
      return res.status(404).json({ message: "Marketer lama helin" });
    }

    // 2. Get campaigns created by marketer
    const campaigns = await Campaign.find({ createdBy: marketerId }).select(
      "title platform budget spent startDate endDate status"
    );
    

    // 3. Get products created by marketer
    const products = await Product.find({ createdBy: marketerId }).select(
      "name price"
    );

    res.json({ marketer, campaigns, products });
  } catch (error) {
    console.error("Error fetching marketer full data:", error);
    res.status(500).json({ message: "Qalad helista xogta" });
  }
};
// Update Campaign
export const updateCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      targetAudience,
      platform,
      budget,
      startDate,
      endDate,
      status,
    } = req.body;
    const files = req.files; // multer middleware ayaa files ku shubaya req.files

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Ololaha lama helin" });
    }

    // Haddii sawirro cusub la upload gareeyay, isticmaal uploadCampaignAssets
    if (files && files.length > 0) {
      const uploadResults = await uploadCampaignAssets(files, campaign._id);
      const urls = uploadResults.map((result) => result.url);
      // Ku dar sawirrada cusub liiska
      campaign.images.push(...urls);
    }

    // Update fields
    campaign.title = title || campaign.title;
    campaign.description = description || campaign.description;
    campaign.targetAudience = targetAudience || campaign.targetAudience;
    campaign.platform = platform || campaign.platform;
    campaign.budget = budget || campaign.budget;
    campaign.startDate = startDate || campaign.startDate;
    campaign.endDate = endDate || campaign.endDate;
    campaign.status = status || campaign.status;
    campaign.updatedAt = new Date();

    await campaign.save();

    res.json({
      message: "Ololaha si guul leh ayaa loo cusboonaysiiyay",
      campaign,
    });
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ message: "Qalad cusboonaysiinta", error: error.message });
  }
};


// Delete Campaign
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign)
      return res.status(404).json({ message: "Ololaha lama helin" });
    res.json({ message: "Ololaha si guul leh ayaa loo tirtiray" });
  } catch (error) {
    res.status(500).json({ message: "Qalad tirtirida" });
  }
};
