import api from "./api";

// GET USER PROFILE
export const getUserProfileAPI = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

// UPDATE USER PROFILE
export const updateUserProfileAPI = async (userData) => {
  const response = await api.put("/users/profile", userData);
  return response.data;
};

// CHANGE PASSWORD
export const changePasswordAPI = async (passwordData) => {
  const response = await api.put("/users/change-password", passwordData);
  return response.data;
};

// ADD ADDRESS
export const addAddressAPI = async (addressData) => {
  const response = await api.post("/users/addresses", addressData);
  return response.data;
};

// DELETE ADDRESS
export const deleteAddressAPI = async (addressId) => {
  const response = await api.delete(`/users/addresses/${addressId}`);
  return response.data;
};
