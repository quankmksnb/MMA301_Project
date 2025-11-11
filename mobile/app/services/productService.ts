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

export const addProduct = async (data: any) => {
  const res = await api.post("/products", data);
  return res.data;
};

// 🟢 Lấy tất cả sản phẩm
export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

// 🟡 Cập nhật sản phẩm
export const updateProduct = async (id: string, data: any) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

// 🔴 Xóa sản phẩm
export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
