import api from "./api";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await api.post("/auth/verify-otp", { email, otp });
  return res.data;
};

export const resendOtp = async (email: string) => {
  const res = await api.post("/auth/resend-otp", { email });
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
