import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { getCategoriesAPI } from "../../services/categoryService";
import MainLayout from "../../layouts/MainLayout";
import ProductCard from "../../components/product/ProductCard";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import useProductStore from "../../store/productStore";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Global Zustand product store binding
  const {
    products,
    loading,
    totalProducts,
    totalPages,
    filters,
    setFilters,
    resetFilters,
    fetchProducts,
  } = useProductStore();

  // Local state for immediate typing feedback
  const [localKeyword, setLocalKeyword] = useState(filters.keyword);
  const debouncedKeyword = useDebounce(localKeyword, 500);

  // Dynamic Categories state
  const [categories, setCategories] = useState(["Electronics", "Fashion", "Home & Garden", "Sports", "Books"]);

  // Sync URL search params to Zustand store ONCE on initial mount
  useEffect(() => {
    const urlParams = {
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sort: searchParams.get("sort") || "",
      inStock: searchParams.get("inStock") === "true",
      minRating: searchParams.get("minRating") || "",
      page: Number(searchParams.get("page")) || 1,
    };
    setFilters(urlParams);
    setLocalKeyword(urlParams.keyword);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesAPI();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load categories in store view", error);
      }
    };
    fetchCategories();
  }, []);

  // Sync local keyword input when the global store filter is modified from outside
  useEffect(() => {
    setLocalKeyword(filters.keyword);
  }, [filters.keyword]);

  // Sync debounced search to Zustand store filters
  useEffect(() => {
    if (filters.keyword !== debouncedKeyword) {
      setFilters({ keyword: debouncedKeyword, page: 1 });
    }
  }, [debouncedKeyword]);

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();

    // Sync filters back to URL search params to keep links shareable
    const params = new URLSearchParams();
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.inStock) params.set("inStock", "true");
    if (filters.minRating) params.set("minRating", filters.minRating);
    if (filters.page > 1) params.set("page", filters.page);

    setSearchParams(params);
  }, [
    filters.keyword,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.inStock,
    filters.minRating,
    filters.page,
  ]);

  const handleClearFilters = () => {
    resetFilters();
    setLocalKeyword("");
  };

  return (
    <MainLayout>
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="mt-1 text-gray-500">
              Showing {Array.isArray(products) ? products.length : 0} of {totalProducts} products
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ sort: e.target.value, page: 1 })}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md shadow-sm border bg-white"
            >
              <option value="">Sort By: Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR FILTERS */}
          <div className={`w-full md:w-64 flex-shrink-0 space-y-8 ${showFilters ? "block" : "hidden md:block"}`}>
            {/* Search */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Search</h3>
              <Input
                placeholder="Search products..."
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                className="mb-0 bg-white"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="cat-all"
                    type="radio"
                    checked={filters.category === ""}
                    onChange={() => setFilters({ category: "", page: 1 })}
                    className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <label htmlFor="cat-all" className="ml-3 text-sm text-gray-600 cursor-pointer select-none">
                    All Categories
                  </label>
                </div>
                {categories.map((cat) => {
                  const catName = typeof cat === "object" ? cat.name : cat;
                  const catValue = typeof cat === "object" ? cat.name : cat;
                  return (
                    <div key={catName} className="flex items-center">
                      <input
                        id={`cat-${catName}`}
                        type="radio"
                        checked={filters.category === catValue}
                        onChange={() => setFilters({ category: catValue, page: 1 })}
                        className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                      <label htmlFor={`cat-${catName}`} className="ml-3 text-sm text-gray-600 cursor-pointer select-none">
                        {catName}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Price Range</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ minPrice: e.target.value, page: 1 })}
                  className="mb-0 bg-white"
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ maxPrice: e.target.value, page: 1 })}
                  className="mb-0 bg-white"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Minimum Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      id={`rating-${rating}`}
                      type="radio"
                      checked={String(filters.minRating) === String(rating)}
                      onChange={() => setFilters({ minRating: String(rating), page: 1 })}
                      className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor={`rating-${rating}`} className="ml-3 text-sm text-gray-600 cursor-pointer flex items-center select-none">
                      {[...Array(rating)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                      {[...Array(5 - rating)].map((_, i) => <span key={i} className="text-gray-300">★</span>)}
                      <span className="ml-1">& Up</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Availability</h3>
              <div className="flex items-center">
                <input
                  id="in-stock"
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ inStock: e.target.checked, page: 1 })}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <label htmlFor="in-stock" className="ml-3 text-sm text-gray-600 cursor-pointer select-none">
                  In Stock Only
                </label>
              </div>
            </div>

            <Button
              variant="secondary"
              fullWidth
              onClick={handleClearFilters}
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </div>

          {/* PRODUCT GRID */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <Skeleton key={i} type="card" className="rounded-2xl" />)}
              </div>
            ) : !Array.isArray(products) || products.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => {
                    setFilters({ page: newPage });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;