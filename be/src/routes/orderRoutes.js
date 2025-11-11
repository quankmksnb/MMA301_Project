import express from "express";
import {
  checkout,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, sellerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", protect, checkout);
router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, sellerOnly, updateOrderStatus);

export default router;
