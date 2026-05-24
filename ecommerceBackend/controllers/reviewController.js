import Review from "../models/ReviewModel.js";
import Product from "../models/ProductModel.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const productId = req.params.productId;

    /*
    ============================
    CHECK PRODUCT EXISTS
    ============================
    */

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    /*
    ============================
    ONE REVIEW PER USER
    ============================
    */

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    /*
    ============================
    CREATE REVIEW
    ============================
    */

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    /*
    ============================
    LINK REVIEW TO PRODUCT
    ============================
    */

    product.reviews.push(review._id);

    /*
    ============================
    UPDATE RATING
    ============================
    */

    const reviews = await Review.find({
      product: productId,
    });

    product.numReviews = reviews.length;

    product.rating =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    /*
    ============================
    CHECK OWNERSHIP
    ============================
    */

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const product = await Product.findById(review.product);

    /*
    ============================
    DELETE REVIEW
    ============================
    */

    await review.deleteOne();

    /*
    ============================
    REMOVE FROM PRODUCT
    ============================
    */

    product.reviews = product.reviews.filter(
      (id) => id.toString() !== review._id.toString()
    );

    /*
    ============================
    RECALCULATE RATINGS
    ============================
    */

    const remainingReviews = await Review.find({
      product: product._id,
    });

    product.numReviews = remainingReviews.length;

    if (remainingReviews.length > 0) {
      product.rating =
        remainingReviews.reduce(
          (acc, item) => acc + item.rating,
          0
        ) / remainingReviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this review" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    const updatedReview = await review.save();

    // Recalculate product rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: product._id });
    
    if (reviews.length > 0) {
      product.rating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
    }
    await product.save();

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};