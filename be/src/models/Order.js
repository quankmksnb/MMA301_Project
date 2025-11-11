import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  price: Number,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryAddress" },
  paymentMethod: { type: String, enum: ["COD", "PayPal"], default: "COD" },
  status: {
    type: String,
    enum: ["pending", "confirmed", "delivering", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
