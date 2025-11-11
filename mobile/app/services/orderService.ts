import api from "./api";

export const checkout = async (addressId: string, paymentMethod: string) => {
  const res = await api.post("/orders/checkout", { addressId, paymentMethod });
  return res.data;
};

export const getUserOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const getOrderDetail = async (orderId: string) => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};

export const cancelOrder = async (id: string) => {
  const res = await api.put(`/orders/${id}/cancel`);
  return res.data;
};

export const getOrderById = async (id: string) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};