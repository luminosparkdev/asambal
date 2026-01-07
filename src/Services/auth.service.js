import axios from "axios";

const API_URL = "http://localhost:3000/api/auth"; 

export const loginService = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data; 
};

export const activateAccountService = async (email, newPassword, token) => {
  const response = await axios.post(`${API_URL}/activate-account`, {
    email,
    password: newPassword,
    token,
  });
  return response.data; 
};
