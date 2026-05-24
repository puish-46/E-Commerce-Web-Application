import api from "./api";

// GET ALL PRODUCTS
export const getProducts = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.category) queryParams.append('category', params.category);
  if (params.brand) queryParams.append('brand', params.brand);
  if (params.minPrice) queryParams.append('minPrice', params.minPrice);
  if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.inStock) queryParams.append('inStock', params.inStock);
  if (params.minRating) queryParams.append('minRating', params.minRating);

  const response = await api.get(`/products?${queryParams.toString()}`);
  return response.data;
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

// GET RELATED PRODUCTS
export const getRelatedProductsAPI = async (productId) => {
  const response = await api.get(`/products/${productId}/related`);
  return response.data;
};