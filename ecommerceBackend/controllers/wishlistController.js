import Wishlist from "../models/WishlistModel.js";
import Product from "../models/ProductModel.js";

// GET WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    
    if (!wishlist) {
      return res.status(200).json([]);
    }
    
    res.status(200).json(wishlist.products || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD TO WISHLIST
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    if (wishlist.products.includes(productId)) {
      await wishlist.populate("products");
      return res.status(200).json(wishlist.products || []);
    }

    wishlist.products.push(productId);
    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json(wishlist.products || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== req.params.productId
    );

    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json(wishlist.products || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};