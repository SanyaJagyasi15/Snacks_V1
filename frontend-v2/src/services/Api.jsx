import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const Api = axios.create({
  baseURL: API_BASE_URL,
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  try {
    const response = await Api.post("/auth/login", { username, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await Api.post("/users/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addReceipt = async (formData) => {
  try {
    const response = await Api.post("/receipts", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  // Add any other session-related data that needs to be cleared
};

export const getAllReceipts = async () => {
  try {
    const response = await Api.get("/receipts");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getReceiptById = async (id) => {
  try {
    const response = await Api.get(`/receipts/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateReceipt = async (id, receiptData) => {
  try {
    const response = await Api.put(`/receipts/${id}`, receiptData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReceipt = async (id) => {
  try {
    const response = await Api.delete(`/receipts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return localStorage.getItem("username");
};

export const getMonthlyTotalNotification = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await Api.get("/notifications/monthly-total", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export default Api;
