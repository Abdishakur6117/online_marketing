import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  updateOrder,
  cancelOrder,
  deleteOrder,
  getOrdersFromMyProducts,
  getOrdersFromMyProductsByCustomer,
} from "../controllers/OrderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Create Order (Customer)
router.post("/",authMiddleware, createOrder);

router.get("/my-orders", authMiddleware, getOrdersFromMyProducts);
router.get(
  "/my-orders/:userId",
  authMiddleware,
  getOrdersFromMyProductsByCustomer
);

// Get User Orders (Customer)
router.get("/user/:userId", getUserOrders);
// GET /api/orders/from-user/:userId/my-products


// router.get("/customer/:userId", getUserOrders);
// router.get("/customer/:customerId", getOrdersByCustomer);
// Get All Orders (Admin)
router.get("/", authMiddleware, getAllOrders);

// Update Order Status (Admin)
router.put("/:orderId/status", authMiddleware, updateOrderStatus);
// Update Order details (customer/Admin)
router.put("/:orderId", authMiddleware, updateOrder);
// Cancel Order (Customer/Admin)
router.put("/:orderId/cancel", authMiddleware, cancelOrder);
// delete Order (Customer/Admin)
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
