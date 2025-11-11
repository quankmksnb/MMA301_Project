import express from "express";
import { protect, sellerOnly } from "../middleware/authMiddleware.js";
import { createProduct, getProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", protect, sellerOnly, createProduct);

export default router;
