import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import { protect, sellerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, sellerOnly, createCategory);

export default router;
