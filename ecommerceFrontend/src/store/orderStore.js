import { create } from "zustand";

const useOrderStore = create(
  (set) => ({
    
    //STATE
    orders: [],
    loading: false,

    
    //ACTIONS
    setOrders: (orders) =>
      set({
        orders,
      }),

    setLoading: (loading) =>
      set({
        loading,
      }),
  })
);

export default useOrderStore;