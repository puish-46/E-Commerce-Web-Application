import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  addAddress,
  deleteAddress,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put("/change-password", protect, changePassword);

router.route("/addresses")
  .post(protect, addAddress);

router.route("/addresses/:id")
  .delete(protect, deleteAddress);

export default router;
