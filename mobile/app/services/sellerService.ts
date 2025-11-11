import api from "./api"; // ✅ axios instance đã config sẵn (baseURL + token interceptors)

/**
 * 🧾 Lấy tất cả đơn hàng (seller only)
 * GET /api/seller/orders
 */
export const getAllOrders = async () => {
  const res = await api.get("/seller/orders");
  return res.data;
};

/**
 * 👥 Lấy tất cả người dùng (seller only)
 * GET /api/seller/users
 */
export const getAllUsers = async () => {
  const res = await api.get("/seller/users");
  return res.data;
};


// 🟠 Update trạng thái đơn hàng
export const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await api.put(`/orders/${orderId}/status`, { status });
  return res.data;
};

// 🟢 Seller xem chi tiết 1 order
export const getOrderDetailBySeller = async (orderId: string) => {
  const res = await api.get(`/seller/orders/${orderId}`);
  return res.data;
};