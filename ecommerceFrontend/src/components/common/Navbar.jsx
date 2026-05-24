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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-obsidian-950/90 border-b border-obsidian-800 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-accent-500 rounded-xl flex items-center justify-center shadow-md shadow-accent-500/10 group-hover:bg-accent-600 transition-colors">
              <span className="text-obsidian-950 font-black text-lg">M</span>
            </div>
            <span className="text-lg font-black tracking-tight text-white group-hover:text-accent-500 transition-colors font-sans">
              Merchant Grid
            </span>
          </Link>

          {/* MIDDLE NAVIGATION LINKS */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-xs font-bold uppercase tracking-wider text-obsidian-300 hover:text-accent-500 transition-colors">
              Products
            </Link>

            <Link to="/cart" className="text-xs font-bold uppercase tracking-wider text-obsidian-300 hover:text-accent-500 transition-colors flex items-center gap-1.5">
              Cart
              {cart?.items?.length > 0 && (
                <span className="bg-accent-500 text-obsidian-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  {cart.items.length}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="text-xs font-bold uppercase tracking-wider text-obsidian-300 hover:text-accent-500 transition-colors flex items-center gap-1.5">
              Wishlist
              {wishlist?.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {user && (
              <Link to="/my-orders" className="text-xs font-bold uppercase tracking-wider text-obsidian-300 hover:text-accent-500 transition-colors">
                Orders
              </Link>
            )}

            {/* ADMIN ACCESS TAG */}
            {user?.role === "admin" && (
              <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 border border-accent-500/20 px-3 py-1 rounded-lg hover:bg-accent-500/20 transition-all">
                Admin Panel
              </Link>
            )}
          </div>

          {/* USER ACTIONS */}
          <div className="flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-obsidian-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-accent-500 text-obsidian-950 hover:bg-accent-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-accent-500/10">
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-8 h-8 rounded-xl bg-obsidian-800 overflow-hidden border border-obsidian-750 shadow-xs">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent-500 text-xs font-black uppercase bg-accent-500/10">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-obsidian-300 group-hover:text-accent-500 transition-colors">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-obsidian-300 hover:text-rose-500 text-xs font-bold transition-colors focus:outline-none cursor-pointer"
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