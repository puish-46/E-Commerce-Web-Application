import api from "./api";

// GET ALL CATEGORIES
export const getCategoriesAPI = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// CREATE CATEGORY (Admin Only)
export const createCategoryAPI = async (categoryData) => {
  const response = await api.post("/categories", categoryData);
  return response.data;
};

// UPDATE CATEGORY (Admin Only)
export const updateCategoryAPI = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

// DELETE CATEGORY (Admin Only)
export const deleteCategoryAPI = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
