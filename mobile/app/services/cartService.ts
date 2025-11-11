import api from "./api";

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const addToCart = async (productId: string, quantity = 1) => {
  const res = await api.post("/cart/add", { productId, quantity });
  return res.data;
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const res = await api.put("/cart/update", { productId, quantity });
  return res.data;
};

export const removeFromCart = async (productId: string) => {
  const res = await api.delete(`/cart/remove/${productId}`);
  return res.data;
};
