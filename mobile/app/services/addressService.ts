import api from "./api";

export const getAddresses = async () => {
  const res = await api.get("/address");
  return res.data;
};

export const addAddress = async (data: any) => {
  const res = await api.post("/address", data);
  return res.data;
};

export const updateAddress = async (id: string, data: any) => {
  const res = await api.put(`/address/${id}`, data);
  return res.data;
};

export const deleteAddress = async (id: string) => {
  const res = await api.delete(`/address/${id}`);
  return res.data;
};

export const setDefaultAddress = async (id: string) => {
  const res = await api.put(`/address/${id}/default`);
  return res.data;
};

export const getDefaultAddress = async () => {
  const res = await api.get("/address/default");
  return res.data;
};