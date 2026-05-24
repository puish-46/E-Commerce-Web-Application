import api from "./api";

// ADD REVIEW
export const addReviewAPI = async (productId, reviewData) => {
  const response = await api.post(`/reviews/${productId}`, reviewData);
  return response.data;
};

// GET REVIEWS
export const getProductReviewsAPI = async (productId) => {
  const response = await api.get(`/reviews/${productId}`);
  return response.data;
};

// UPDATE REVIEW
export const updateReviewAPI = async (productId, reviewId, reviewData) => {
  const response = await api.put(`/reviews/${productId}/${reviewId}`, reviewData);
  return response.data;
};

// DELETE REVIEW
export const deleteReviewAPI = async (productId, reviewId) => {
  const response = await api.delete(`/reviews/${productId}/${reviewId}`);
  return response.data;
};
