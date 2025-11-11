import express from "express";
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/deliveryAddressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyAddresses);
router.post("/", protect, addAddress);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);
router.put("/:id/default", protect, setDefaultAddress);

export default router;
