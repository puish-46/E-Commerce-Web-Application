import api from "./api";

// GET ALL PRODUCTS
export const getAdminProductsAPI = async () => {
  const response = await api.get("/products/admin");
  return response.data;
};

// CREATE PRODUCT
export const createProductAPI = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

// DELETE PRODUCT
export const deleteProductAPI = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// UPDATE PRODUCT
export const updateProductAPI = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};