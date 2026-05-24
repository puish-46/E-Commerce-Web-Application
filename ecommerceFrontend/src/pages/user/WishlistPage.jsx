import { useEffect } from "react";
import { Link } from "react-router";
import MainLayout from "../../layouts/MainLayout";
import useWishlistStore from "../../store/wishlistStore";
import useCartStore from "../../store/cartStore";
import { addToCartAPI } from "../../services/cartService";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import toast from "react-hot-toast";

const WishlistPage = () => {
  // Bind global Zustand wishlist store
  const {
    wishlist,
    loading,
    fetchWishlist,
    removeFromWishlist,
  } = useWishlistStore();

  const setCart = useCartStore((state) => state.setCart);

  // Load wishlist on initial mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Handle removing a product from wishlist
  const handleRemove = async (productId) => {
    const success = await removeFromWishlist(productId);
    if (success) {
      toast.success("Removed from wishlist");
    } else {
      toast.error("Failed to remove item");
    }
  };

  // Move product to cart and remove from wishlist
  const moveToCart = async (product) => {
    try {
      const cartData = await addToCartAPI(product._id, 1);
      setCart(cartData);
      
      // Remove from wishlist
      await removeFromWishlist(product._id);
      
      toast.success(`${product.title} moved to cart!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to move item to cart");
    }
  };

  return (
    <MainLayout>
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="mt-1 text-gray-500">
            Keep track of premium products you love.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          /* SKELETON LOADER GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} type="card" className="rounded-2xl h-80" />
            ))}
          </div>
        ) : !Array.isArray(wishlist) || wishlist.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 max-w-lg mx-auto">
            <div className="text-red-400 text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6 px-4">
              Tap the heart icon on any product page to save your favorite premium items here.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          /* WISHLIST GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              if (!item) return null;
              return (
                <div
                  key={item._id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative"
                >
                  {/* Remove Button Overlay */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm hover:shadow transition-all z-10"
                    title="Remove from Wishlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="none"
                    >
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Image Link */}
                  <Link
                    to={`/products/${item._id}`}
                    className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Body Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs font-semibold tracking-wider text-teal-600 uppercase mb-1 block">
                      {item.brand}
                    </span>
                    <Link
                      to={`/products/${item._id}`}
                      className="hover:text-teal-600 transition-colors"
                    >
                      <h3 className="font-bold text-gray-900 line-clamp-1 mb-2" title={item.title}>
                        {item.title}
                      </h3>
                    </Link>
                    <div className="text-lg font-extrabold text-gray-900 mb-4">
                      ₹{item.price?.toLocaleString("en-IN")}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-auto space-y-2 pt-4 border-t border-gray-50">
                      <Button
                        onClick={() => moveToCart(item)}
                        fullWidth
                        size="sm"
                        disabled={item.stock === 0}
                      >
                        {item.stock === 0 ? "Out of Stock" : "Move To Cart"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default WishlistPage;