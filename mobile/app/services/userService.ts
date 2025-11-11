import api from "./api";

export const getProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.put("/users/update", data);
  return res.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const res = await api.put("/users/change-password", { currentPassword, newPassword });
  return res.data;
};
