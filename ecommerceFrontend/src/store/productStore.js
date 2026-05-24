import { create } from "zustand";
import { getProducts } from "../services/productService";

const useProductStore = create((set, get) => ({
  // State
  products: [],
  totalProducts: 0,
  totalPages: 1,
  loading: false,
  error: null,
  singleProduct: null,

  // Global persistent filters state
  filters: {
    keyword: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
    inStock: false,
    minRating: "",
    page: 1,
  },

  // Actions
  setProducts: (products) =>
    set({
      products,
    }),

  setSingleProduct: (product) =>
    set({
      singleProduct: product,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        keyword: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        sort: "",
        inStock: false,
        minRating: "",
        page: 1,
      },
    });
  },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const data = await getProducts({
        keyword: filters.keyword,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        inStock: filters.inStock,
        minRating: filters.minRating,
        page: filters.page,
        limit: 9,
      });

      set({
        products: data?.products || [],
        totalPages: data?.totalPages || 1,
        totalProducts: data?.totalProducts || 0,
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching products in store:", err);
      set({
        error: err.response?.data?.message || "Failed to load products",
        loading: false,
        products: [],
      });
    }
  },
}));

export default useProductStore;