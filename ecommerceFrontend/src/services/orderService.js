import api from "./api";

// PLACE ORDER
export const placeOrderAPI = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// GET MY ORDERS
export const getMyOrdersAPI = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};