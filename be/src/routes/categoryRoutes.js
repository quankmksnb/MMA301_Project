import express from "express";
import { protect, sellerOnly } from "../middleware/authMiddleware.js";
import { getCategories } from "../controllers/categoryController.js";
import { createCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, sellerOnly, createCategory);

export default router;
