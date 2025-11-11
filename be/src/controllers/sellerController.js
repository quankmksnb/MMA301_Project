// src/controllers/sellerController.js
import Order from "../models/Order.js";
import User from "../models/User.js";

// 🟢 Get all orders (seller only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .populate("deliveryAddress");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🟢 Get all users (seller only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
