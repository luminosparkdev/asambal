import api from "../Api/Api";

// Ahora enviamos email y password
export const loginService = async (email, password) => {
  const response = await api.post(`/auth/login`, { email, password });
  return response.data;
};

export const activateAccountService = async (email, newPassword, token) => {
  const response = await api.post(`/auth/activate-account`, {
    email,
    password: newPassword,
    token,
  });
  return response.data; 
};