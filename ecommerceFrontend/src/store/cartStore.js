import { create } from "zustand";

const useCartStore = create((set) => ({
  
  //STATE
  cart: null,

  loading: false,

  
  //ACTIONS
  setCart: (cartData) =>
    set({
      cart: cartData,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),
}));

export default useCartStore;