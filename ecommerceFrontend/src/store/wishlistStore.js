import { create } from "zustand";
import {
  getWishlistAPI,
  addToWishlistAPI,
  removeWishlistAPI,
} from "../services/wishlistService";

const useWishlistStore = create((set, get) => ({
  // STATE
  wishlist: [],
  loading: false,
  error: null,

  // SETTERS
  setWishlist: (wishlist) =>
    set({
      wishlist: Array.isArray(wishlist) ? wishlist : [],
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  // ACTIONS
  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getWishlistAPI();
      set({
        wishlist: Array.isArray(data) ? data : [],
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch wishlist",
        loading: false,
        wishlist: [],
      });
    }
  },

  addToWishlist: async (productId) => {
    try {
      const data = await addToWishlistAPI(productId);
      set({
        wishlist: Array.isArray(data) ? data : [],
      });
      return true;
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      return false;
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const data = await removeWishlistAPI(productId);
      set({
        wishlist: Array.isArray(data) ? data : [],
      });
      return true;
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      return false;
    }
  },
}));

export default useWishlistStore;