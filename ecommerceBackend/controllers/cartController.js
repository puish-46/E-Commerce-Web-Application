import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    /*
    ============================
    CHECK PRODUCT
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
    STOCK VALIDATION
    ============================
    */

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    /*
    ============================
    FIND CART
    ============================
    */

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    /*
    ============================
    CREATE CART
    ============================
    */

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    /*
    ============================
    CHECK EXISTING PRODUCT
    ============================
    */

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    /*
    ============================
    RECALCULATE TOTAL
    ============================
    */

    let total = 0;

    for (const item of cart.items) {
      const productData = await Product.findById(
        item.product
      );

      total +=
        productData.price * item.quantity;
    }

    cart.totalPrice = total;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        items: [],
        totalPrice: 0,
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !==
        req.params.productId
    );

    /*
    ============================
    RECALCULATE TOTAL
    ============================
    */

    let total = 0;

    for (const item of cart.items) {
      const product = await Product.findById(
        item.product
      );

      total +=
        product.price * item.quantity;
    }

    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};