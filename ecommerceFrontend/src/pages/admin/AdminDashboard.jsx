import { useState, useEffect } from "react";
import { Link } from "react-router";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import Skeleton from "../../components/ui/Skeleton";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Using existing endpoints if available, or just fetching lists to count
        // For a real app, you'd create a specific /api/admin/stats endpoint
        const [productsRes, ordersRes] = await Promise.all([
          api.get("/products"),
          api.get("/orders/all") // Assuming this exists or we just use dummy data for now
        ]);

        const products = productsRes.data.products || [];
        const orders = ordersRes.data || [];
        
        const revenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

        setStats({
          totalProducts: productsRes.data.totalProducts || products.length,
          totalOrders: orders.length,
          totalUsers: 15, // Dummy data for users since we don't have a get all users endpoint yet
          totalRevenue: revenue,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
        // Fallback to zeros on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminLinks = [
    { title: "Manage Products", path: "/admin/products", icon: "📦", color: "bg-blue-500", count: stats.totalProducts },
    { title: "Manage Orders", path: "/admin/orders", icon: "🛍️", color: "bg-teal-500", count: stats.totalOrders },
    { title: "Manage Categories", path: "/admin/categories", icon: "🏷️", color: "bg-purple-500", count: "8" },
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Overview of your store's performance</p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <Skeleton type="text" width="50%" className="mb-4" />
                  <Skeleton type="title" width="80%" />
                </div>
              ))
            ) : (
              <>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                  <span className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">Total Revenue</span>
                  <span className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
                  <div className="mt-4 flex items-center text-sm text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
                    <span className="mr-1">↑</span> 12% from last month
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                  <span className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">Total Orders</span>
                  <span className="text-3xl font-bold text-gray-900">{stats.totalOrders}</span>
                  <div className="mt-4 flex items-center text-sm text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
                    <span className="mr-1">↑</span> 8% from last month
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                  <span className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">Products</span>
                  <span className="text-3xl font-bold text-gray-900">{stats.totalProducts}</span>
                  <div className="mt-4 flex items-center text-sm text-gray-500 bg-gray-100 w-fit px-2 py-1 rounded">
                    Active Listings
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                  <span className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">Customers</span>
                  <span className="text-3xl font-bold text-gray-900">{stats.totalUsers}</span>
                  <div className="mt-4 flex items-center text-sm text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
                    <span className="mr-1">↑</span> 4 new this week
                  </div>
                </div>
              </>
            )}
          </div>

          {/* QUICK LINKS */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adminLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.path}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-teal-300 transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center text-2xl text-white shadow-inner`}>
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{link.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{link.count} total items</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all">
                  →
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;