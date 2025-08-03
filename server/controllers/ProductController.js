import Product from "../models/ProductModel.js";
import { uploadProductImages } from "../middleware/imageKitMiddleware.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, createdBy, stock } = req.body;

    const uploadedImages = await uploadProductImages(req.files); // ✅ sax

    const imageUrls = uploadedImages.map((img) => img.url);

    const product = await Product.create({
      name,
      price,
      description,
      category,
      stock,
      images: imageUrls,
      createdBy: req.user.id, // ✅ Haddii `authMiddleware` uu `req.user` dhigo, waa sax
    });

    res.status(201).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Product creation failed", detail: err.message });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "createdBy",
      "username email"
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Qalad helista alaabta" });
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );
    if (!product)
      return res.status(404).json({ message: "Alaabta lama helin" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Qalad helista alaabta" });
  }
};

// controllers/productController.js
export const getMyProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const products = await Product.find({ createdBy: userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Qalad helista alaabta" });
  }
};


// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const files = req.files;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Alaabta lama helin" });

    // Upload new images if present
    if (Array.isArray(files) && files.length > 0) {
      const uploadedImages = await uploadProductImages(files);
      const imageUrls = uploadedImages.map((img) => img.url);
      product.images.push(...imageUrls);
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    product.updatedAt = new Date();
    await product.save();

    res.json({
      message: "Alaabta si guul leh ayaa loo cusboonaysiiyay",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Qalad cusboonaysiinta", detail: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Alaabta lama helin" });
    res.json({ message: "Alaabta si guul leh ayaa loo tirtiray" });
  } catch (error) {
    res.status(500).json({ message: "Qalad tirtirida" });
  }
};
