import { useEffect, useState } from "react";
import { Link } from "react-router";
import MainLayout from "../../layouts/MainLayout";
import useOrderStore from "../../store/orderStore";
import { getMyOrdersAPI } from "../../services/orderService";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import toast from "react-hot-toast";

const MyOrdersPage = () => {
  const { orders, setOrders, loading, setLoading } = useOrderStore();
  const [expandedOrders, setExpandedOrders] = useState({});

  // FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrdersAPI();
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to load orders", error);
        toast.error("Could not load your order history");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Order ID copied to clipboard!");
  };

  // Status badge styling helper
  const getStatusStyles = (status) => {
    const norm = (status || "pending").toLowerCase();
    switch (norm) {
      case "pending":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} type="card" className="h-44 rounded-2xl" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  const isEmpty = !orders || orders.length === 0;

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen pb-16">
        
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-900 font-sans tracking-tight">My Orders</h1>
            <p className="mt-2 text-sm text-gray-500">
              Track delivery status, review products, and view receipt summaries for your order history.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isEmpty ? (
            /* PREMIUM EMPTY STATE */
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto px-6">
              <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
              <p className="text-gray-500 mb-8">
                You haven't made any purchases yet. Explore our high-quality catalog to find the products you need!
              </p>
              <Link to="/products">
                <Button size="lg" className="px-8 shadow-md shadow-teal-500/10">
                  Shop Our Collection
                </Button>
              </Link>
            </div>
          ) : (
            /* ORDERS LIST */
            <div className="space-y-6">
              {orders.map((order) => {
                const isExpanded = expandedOrders[order._id];
                const orderDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date N/A";

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    
                    {/* Card Header (Meta Info Summary) */}
                    <div className="bg-gray-50/70 p-6 border-b border-gray-150 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-grow">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Date Placed
                          </span>
                          <span className="text-sm font-semibold text-gray-700">{orderDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Total Price
                          </span>
                          <span className="text-sm font-extrabold text-gray-900">
                            ₹{order.totalPrice?.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Status
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyles(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus || "Pending"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Order ID
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-500 font-mono truncate max-w-[100px]" title={order._id}>
                              {order._id}
                            </span>
                            <button
                              onClick={() => copyToClipboard(order._id)}
                              className="text-gray-400 hover:text-teal-600 transition-colors focus:outline-none"
                              title="Copy Order ID"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleExpand(order._id)}
                          className="flex items-center gap-1.5 focus:outline-none"
                        >
                          {isExpanded ? "Hide Details" : "View Details"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transform transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Button>
                      </div>
                    </div>

                    {/* Card Body (Compact Items List) */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.orderItems.map((item) => {
                          const product = item.product || {};
                          return (
                            <div key={item._id} className="flex gap-4 items-center">
                              {/* Product Thumbnail */}
                              <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center p-1.5 shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                                />
                              </div>

                              {/* Title and details */}
                              <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-gray-800 text-sm truncate" title={product.title}>
                                  {product.title || "Product details unavailable"}
                                </h4>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Quantity: <span className="font-semibold text-gray-600">{item.quantity}</span>
                                </p>
                              </div>

                              <div className="shrink-0 text-right">
                                <span className="text-sm font-semibold text-gray-900">
                                  ₹{product.price ? product.price.toLocaleString("en-IN") : "0"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Collapsible Invoice breakdown */}
                    {isExpanded && (
                      <div className="bg-gray-50/40 p-6 border-t border-gray-150 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                        
                        {/* Shipping details */}
                        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex flex-col">
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Shipping Details
                          </h5>
                          <p className="text-sm font-semibold text-gray-800 mb-1">
                            Delivery Address
                          </p>
                          <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line flex-grow">
                            {order.shippingAddress || "No shipping address details found."}
                          </p>
                        </div>

                        {/* Payment details */}
                        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex flex-col">
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Payment Details
                          </h5>
                          <div className="space-y-2 flex-grow">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500">Method:</span>
                              <span className="font-bold text-gray-800 uppercase">{order.paymentMethod || "COD"}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500">Status:</span>
                              <span className="font-bold text-emerald-600">Paid / Success</span>
                            </div>
                          </div>
                        </div>

                        {/* Cost summary details */}
                        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-between">
                          <div>
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                              Order Cost Breakdown
                            </h5>
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Subtotal</span>
                                <span>₹{order.totalPrice?.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Shipping</span>
                                <span className="text-emerald-600 font-medium">Free</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-end">
                            <span className="text-xs font-bold text-gray-800">Final Charged</span>
                            <span className="text-base font-black text-gray-900">
                              ₹{order.totalPrice?.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
};

export default MyOrdersPage;