import api from "./api";

// ADD TO CART
export const addToCartAPI = async (productId, quantity) => {
  const response = await api.post("/cart", {
    productId,
    quantity,
  });
  return response.data;
};

// GET CART
export const getCartAPI = async () => {
  const response = await api.get("/cart");
  return response.data;
};

// REMOVE FROM CART
export const removeFromCartAPI = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};