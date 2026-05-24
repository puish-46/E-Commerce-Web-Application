import express from "express";

import {
  addReview,
  getProductReviews,
  deleteReview,
  updateReview,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/:productId")
  .post(protect, addReview)
  .get(getProductReviews);

router
  .route("/:productId/:reviewId")
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;