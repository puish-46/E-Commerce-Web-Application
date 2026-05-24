import { BrowserRouter as Router, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import ScrollToTop from "./components/common/ScrollToTop";
import Skeleton from "./components/ui/Skeleton";

// Lazy load pages
const HomePage = lazy(() => import("./pages/user/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ProductsPage = lazy(() => import("./pages/user/ProductsPage"));
const ProductDetailsPage = lazy(() => import("./pages/user/ProductDetailsPage"));
const CartPage = lazy(() => import("./pages/user/CartPage"));
const CheckoutPage = lazy(() => import("./pages/user/CheckoutPage"));
const MyOrdersPage = lazy(() => import("./pages/user/MyOrdersPage"));
const WishlistPage = lazy(() => import("./pages/user/WishlistPage"));
const Profile = lazy(() => import("./pages/user/Profile"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const ManageCategories = lazy(() => import("./pages/admin/ManageCategories"));

const PageLoader = () => (
  <div className="min-h-screen flex flex-col pt-16 px-4 max-w-7xl mx-auto">
    <Skeleton type="title" className="mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Skeleton type="card" />
      <Skeleton type="card" />
      <Skeleton type="card" />
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* USER ROUTES */}
          <Route element={<UserRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* PROTECTED USER ROUTES */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<AdminRoutes />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;