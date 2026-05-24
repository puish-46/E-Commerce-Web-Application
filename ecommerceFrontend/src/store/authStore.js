import { create } from "zustand";

// Helper to safely parse user from localStorage
const getInitialUser = () => {
  const localUser = localStorage.getItem("user");
  if (!localUser) return null;
  try {
    return JSON.parse(localUser);
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem("user");
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getInitialUser(),
  token: localStorage.getItem("token") || null,
  loading: false,

  // SET USER ONLY (e.g. updating profile details)
  setUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },

  // SET TOKEN ONLY
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },

  // LOGIN
  login: (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    set({
      user: userData,
      token,
    });
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
    });
  },
}));

export default useAuthStore;