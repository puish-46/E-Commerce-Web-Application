import express from "express";

import {
  placeOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/my-orders", protect, getMyOrders);

router.get(
  "/admin",
  protect,
  admin,
  getAllOrders
);

router.get("/:id", protect, getSingleOrder);

router.put(
  "/:id/status",
  protect,
  admin,
  updateOrderStatus
);

export default router;