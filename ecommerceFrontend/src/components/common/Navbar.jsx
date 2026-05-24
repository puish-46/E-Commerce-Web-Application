import { Link } from "react-router";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cart = useCartStore((state) => state.cart);
  const wishlist = useWishlistStore((state) => state.wishlist);

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gray-200/50 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm shadow-teal-500/10 group-hover:bg-teal-700 transition-colors">
              <span className="text-white font-black text-lg">M</span>
            </div>
            <span className="text-lg font-black tracking-tight text-gray-900 group-hover:text-teal-600 transition-colors">
              Merchant Grid
            </span>
          </Link>

          {/* MIDDLE NAVIGATION LINKS */}
          <div className="hidden md:flex items-center space-x-7">
            <Link to="/products" className="text-sm text-gray-600 hover:text-teal-600 font-semibold transition-colors">
              Products
            </Link>

            <Link to="/cart" className="text-sm text-gray-600 hover:text-teal-600 font-semibold transition-colors flex items-center gap-1.5">
              Cart
              {cart?.items?.length > 0 && (
                <span className="bg-teal-50 text-teal-750 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-teal-100">
                  {cart.items.length}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="text-sm text-gray-600 hover:text-teal-600 font-semibold transition-colors flex items-center gap-1.5">
              Wishlist
              {wishlist?.length > 0 && (
                <span className="bg-rose-50 text-rose-750 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-100">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {user && (
              <Link to="/my-orders" className="text-sm text-gray-600 hover:text-teal-600 font-semibold transition-colors">
                Orders
              </Link>
            )}

            {/* ADMIN ACCESS TAG */}
            {user?.role === "admin" && (
              <Link to="/admin" className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-150 px-2.5 py-1 rounded-lg hover:bg-teal-100 transition-all">
                Admin Panel
              </Link>
            )}
          </div>

          {/* USER ACTIONS */}
          <div className="flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 font-semibold transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-teal-500/10">
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shadow-xs">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-teal-600 text-xs font-black uppercase bg-teal-50">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-700 group-hover:text-teal-600 transition-colors">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-500 text-xs font-bold transition-colors focus:outline-none"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;