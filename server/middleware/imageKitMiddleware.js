import multer from "multer";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

// ImageKit configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Common multer memory storage
const storage = multer.memoryStorage();

// 1️⃣ For user profile image (single file)
export const uploadMiddlewareUser = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image"); // <input name="image" />

// 2️⃣ For product images (up to 5 files)
export const uploadMiddlewareProduct = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 5); // <input name="images" multiple />

// Upload single image to ImageKit (e.g. user profile)
export const uploadToImageKit = (file) => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: file.buffer,
        fileName: `user_${Date.now()}.jpg`,
        folder: "/users",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

// Upload multiple product images to ImageKit
export const uploadProductImages = async (files) => {
  const uploads = files.map((file, index) =>
    imagekit.upload({
      file: file.buffer,
      fileName: `product_${Date.now()}_${index + 1}.jpg`,
      folder: "/products",
    })
  );
  return Promise.all(uploads); // Returns array of uploaded image results
};

// 3️⃣ For campaign images (up to 3 files)
export const uploadMiddlewareCampaign = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 3);
// ✅ Upload campaigns
export const uploadCampaignAssets = async (files) => {
  const uploads = files.map((file, index) => {
    return imagekit.upload({
      file: file.buffer,
      fileName: `campaign_${Date.now()}_${index + 1}.jpg`,
      folder: "/campaigns",
    });
  });

  return Promise.all(uploads);
};


// 4️⃣ For content images (up to 5 files)
export const uploadMiddlewareContent = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("mediaUrl", 5);

// ✅ Upload content images to ImageKit
export const uploadContentAssets = async (files) => {
  const uploads = files.map((file, index) => {
    return imagekit.upload({
      file: file.buffer,
      fileName: `content_${Date.now()}_${index + 1}.jpg`,
      folder: "/contents",
    });
  });

  return Promise.all(uploads);
};
