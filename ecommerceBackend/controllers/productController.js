import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      image,
      images,
      brand,
      category,
      stock,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !image ||
      !brand ||
      !category
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      image,
      images,
      brand,
      category,
      stock,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page,
      limit: queryLimit,
      inStock,
      minRating
    } = req.query;

    const query = {};

    
    //SEARCH
    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    
    //CATEGORY FILTER
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, "i") } });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          query.category = new mongoose.Types.ObjectId(); // No match
        }
      }
    }

    
    //BRAND FILTER
    if (brand) {
      query.brand = {
        $regex: brand,
        $options: "i",
      };
    }

    
    //PRICE FILTER
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // STOCK FILTER
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // RATING FILTER
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    
    //PAGINATION
    const pageNumber = Number(page) || 1;

    const limit = Number(queryLimit) || 10;

    const skip = (pageNumber - 1) * limit;

    
    //SORTING
    let sortOption = {};

    switch (sort) {
      case "price_asc":
        sortOption.price = 1;
        break;

      case "price_desc":
        sortOption.price = -1;
        break;

      case "rating":
        sortOption.rating = -1;
        break;

      case "newest":
        sortOption.createdAt = -1;
        break;

      default:
        sortOption.createdAt = -1;
    }

    
    //FETCH PRODUCTS
    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    
    //TOTAL PRODUCTS
    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      products,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getSingleProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.title = req.body.title || product.title;
    product.description =
      req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.images = req.body.images || product.images;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .populate("category", "name")
      .limit(4);

    res.status(200).json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PRODUCTS FOR ADMIN (No pagination limit)
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      products,
      totalProducts: products.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};