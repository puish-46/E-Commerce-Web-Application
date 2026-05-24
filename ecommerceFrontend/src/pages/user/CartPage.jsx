import { useEffect } from "react";
import { Link } from "react-router";
import MainLayout from "../../layouts/MainLayout";
import useCartStore from "../../store/cartStore";
import {
  getCartAPI,
  addToCartAPI,
  removeFromCartAPI,
} from "../../services/cartService";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import toast from "react-hot-toast";

const CartPage = () => {
  const { cart, setCart, loading, setLoading } = useCartStore();

  // FETCH POPULATED CART ON MOUNT
  const fetchCart = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const data = await getCartAPI();
      setCart(data);
    } catch (error) {
      console.error("Failed to load cart", error);
      toast.error("Could not retrieve your cart items");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart(true);
  }, []);

  // QUANTITY CONTROL ADJUSTMENTS
  const handleQuantityChange = async (item, change) => {
    const newQty = item.quantity + change;
    
    // If quantity is reduced to 0, completely remove it
    if (newQty <= 0) {
      await handleRemove(item.product._id);
      return;
    }

    // Verify stock availability on increments
    if (change > 0 && item.product.stock < newQty) {
      toast.error(`Only ${item.product.stock} items left in stock`);
      return;
    }

    try {
      // call addToCartAPI with incremental change (+1 or -1)
      await addToCartAPI(item.product._id, change);
      // Fetch fully populated cart to update visual prices
      await fetchCart(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  };

  // REMOVE ITEM FROM CART
  const handleRemove = async (productId) => {
    try {
      await removeFromCartAPI(productId);
      await fetchCart(false);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  // Helper variables for order summary
  const subtotal = cart?.totalPrice || 0;
  const shippingThreshold = 999;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 99;
  const total = subtotal + shippingCost;

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} type="card" className="h-32 rounded-2xl" />
              ))}
            </div>
            <div className="lg:col-span-4">
              <Skeleton type="card" className="h-80 rounded-2xl" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen pb-16">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage items you added to your basket and proceed to checkout.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isEmpty ? (
            /* EMPTY CART PREMIUM STATE */
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto px-6">
              <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">
                Looks like you haven't added anything premium to your cart yet. Take a look at our current catalog!
              </p>
              <Link to="/products">
                <Button size="lg" className="shadow-md shadow-teal-500/10 px-8">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            /* CART CONTENT GRID */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Cart Items */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-150 flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-lg">
                      Cart Items ({cart.items.length})
                    </span>
                    <Link to="/products" className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                      Add more items
                    </Link>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {cart.items.map((item) => {
                      if (!item.product) return null;
                      return (
                        <div
                          key={item._id}
                          className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors"
                        >
                          {/* Image */}
                          <Link
                            to={`/products/${item.product._id}`}
                            className="w-full sm:w-28 h-28 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-gray-100 shrink-0"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="max-h-full max-w-full object-contain mix-blend-multiply"
                            />
                          </Link>

                          {/* Detail Info */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-4 mb-1">
                                <Link
                                  to={`/products/${item.product._id}`}
                                  className="font-bold text-gray-900 hover:text-teal-600 transition-colors line-clamp-2 text-base"
                                >
                                  {item.product.title}
                                </Link>
                                <span className="font-extrabold text-gray-900 text-lg shrink-0">
                                  ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                </span>
                              </div>
                              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                {item.product.brand}
                              </span>
                            </div>

                            {/* Controls Footer */}
                            <div className="flex items-center justify-between mt-4">
                              {/* Quantity Selector */}
                              <div className="flex items-center border border-gray-250 rounded-lg bg-white shadow-sm">
                                <button
                                  onClick={() => handleQuantityChange(item, -1)}
                                  className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-teal-600 font-bold transition-colors focus:outline-none"
                                >
                                  -
                                </button>
                                <span className="w-10 text-center font-bold text-gray-800 text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item, 1)}
                                  className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-teal-600 font-bold transition-colors focus:outline-none"
                                  disabled={item.quantity >= item.product.stock}
                                >
                                  +
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemove(item.product._id)}
                                className="text-sm font-semibold text-gray-450 hover:text-red-500 transition-colors flex items-center gap-1.5 focus:outline-none"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Summary Card */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                
                {/* Order Summary */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 items-center">
                      <span className="flex items-center gap-1">
                        Shipping
                        {subtotal >= shippingThreshold && (
                          <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            FREE
                          </span>
                        )}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 text-xs text-teal-700 flex gap-2">
                        <span className="font-bold">💡</span>
                        <span>
                          Add <b>₹{(shippingThreshold - subtotal).toLocaleString("en-IN")}</b> more to qualify for Free Shipping!
                        </span>
                      </div>
                    )}
                    <hr className="border-gray-150" />
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-gray-900 text-base">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-gray-900">₹{total.toLocaleString("en-IN")}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">VAT / GST included where applicable</p>
                      </div>
                    </div>
                  </div>

                  <Link to="/checkout" className="block">
                    <Button
                      size="lg"
                      fullWidth
                      className="shadow-md shadow-teal-500/20 py-3.5 text-base font-bold"
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>

                {/* Promo Code section */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Promo Code</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500 shadow-sm bg-gray-50/50"
                    />
                    <Button variant="secondary" className="shrink-0 px-4">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Gurarantees */}
                <div className="text-center text-xs text-gray-400 space-y-1 py-2">
                  <p>🔒 256-bit SSL encrypted checkout and payments</p>
                  <p>📦 Return eligible within 30 days of delivery</p>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
};

export default CartPage;