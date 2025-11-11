import api from "./api";

// 🟢 Lấy danh sách sản phẩm
export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

// 🟠 Lấy danh mục sản phẩm
export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

// 🟣 Thêm sản phẩm vào giỏ hàng
export const addToCart = async (productId: string, quantity = 1) => {
  const res = await api.post("/cart/add", { productId, quantity });
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
