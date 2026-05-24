import api from "./api";

// GET ALL ORDERS
export const getAllOrdersAPI = async () => {
  const response = await api.get("/orders/admin");
};

// UPDATE ORDER STATUS
export const updateOrderStatusAPI = async (orderId, orderStatus) => {
  const response = await api.put(`/orders/${orderId}/status`, { orderStatus });
  return response.data;
};