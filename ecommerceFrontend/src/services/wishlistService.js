import api from "./api";

// ADD TO WISHLIST
export const addToWishlistAPI = async (productId) => {
  const response = await api.post("/wishlist", { productId });
  return response.data;
};

// GET WISHLIST
export const getWishlistAPI = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

// REMOVE FROM WISHLIST
export const removeWishlistAPI = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};