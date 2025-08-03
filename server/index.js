import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes.js"; 

dotenv.config();

const app = express();
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173", // frontend URL-gaaga saxda ah
  credentials: true, // oggolow cookies iyo auth headers
};

app.use(cors(corsOptions));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB   connected"))
  .catch((err) => console.error("❌ Mongo connection failed:", err));

  
// Routes
// app.use("/api/users/", userRoutes);
app.use("/api/auth", authRoutes);
app.use( userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
