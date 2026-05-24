import Product from "../models/ProductModel.js";
import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  
  const orders = await Order.find();
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  res.json({
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue,
  });
});
