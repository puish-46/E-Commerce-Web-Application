import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAllOrdersAPI,
  updateOrderStatusAPI,
} from "../../services/adminOrderService";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import toast from "react-hot-toast";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrdersAPI();
      setOrders(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // UPDATE STATUS
  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatusAPI(orderId, status);
      fetchOrders();
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "warning";
      case "Processing":
        return "info";
      default:
        return "neutral";
    }
  };

  return (
    <AdminLayout>
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Orders</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor, fulfill, and update the shipping statuses of client purchases.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <Skeleton type="text" width="30%" />
          <Skeleton type="card" />
          <Skeleton type="card" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-3xl">
            🛍️
          </div>
          <h3 className="text-lg font-bold text-slate-800">No orders found</h3>
          <p className="text-slate-500 text-sm mt-1">Orders placed by customers will appear here automatically.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Order ID / Customer</th>
                  <th className="py-4 px-6">Products</th>
                  <th className="py-4 px-6 text-right">Total Price</th>
                  <th className="py-4 px-6 text-center">Fulfillment</th>
                  <th className="py-4 px-6 text-center">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors align-top">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 font-mono text-xs">{order._id}</p>
                      <p className="text-sm font-semibold text-slate-700 mt-1">{order.user?.name || "Guest"}</p>
                      <p className="text-xs text-slate-400">{order.user?.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="text-xs text-slate-600">
                            <span className="font-bold text-slate-800">{item.product?.title || "Product"}</span>
                            <span className="text-slate-400 ml-1">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge variant={getStatusVariant(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          disabled={order.orderStatus === "Processing"}
                          onClick={() => handleStatusUpdate(order._id, "Processing")}
                          className="px-2 py-1 text-xs font-semibold rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Process
                        </button>
                        <button
                          disabled={order.orderStatus === "Shipped"}
                          onClick={() => handleStatusUpdate(order._id, "Shipped")}
                          className="px-2 py-1 text-xs font-semibold rounded border border-amber-200 text-amber-600 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Ship
                        </button>
                        <button
                          disabled={order.orderStatus === "Delivered"}
                          onClick={() => handleStatusUpdate(order._id, "Delivered")}
                          className="px-2 py-1 text-xs font-semibold rounded border border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Deliver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrdersPage;