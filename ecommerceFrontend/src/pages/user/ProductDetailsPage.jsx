import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import MainLayout from "../../layouts/MainLayout";
import useProductStore from "../../store/productStore";
import { getSingleProduct, getRelatedProductsAPI } from "../../services/productService";
import useCartStore from "../../store/cartStore";
import { addToCartAPI } from "../../services/cartService";
import useWishlistStore from "../../store/wishlistStore";
import { addToWishlistAPI, removeWishlistAPI } from "../../services/wishlistService";
import Button from "../../components/ui/Button";
import StarRating from "../../components/ui/StarRating";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import ProductCard from "../../components/product/ProductCard";
import ReviewList from "../../components/review/ReviewList";
import ReviewForm from "../../components/review/ReviewForm";
import { getProductReviewsAPI, addReviewAPI, updateReviewAPI, deleteReviewAPI } from "../../services/reviewService";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { singleProduct, setSingleProduct, loading, setLoading } = useProductStore();
  const user = useAuthStore((state) => state.user);
  
  // Hooks called before early returns
  const setCart = useCartStore((state) => state.setCart);
  const { wishlist, setWishlist } = useWishlistStore();
  const { addViewedProduct } = useRecentlyViewed();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  // Check if product is in wishlist
  const isInWishlist = wishlist?.some(item => 
    (item.product?._id === singleProduct?._id) || (item._id === singleProduct?._id)
  );

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        // Fetch Product
        const data = await getSingleProduct(id);
        setSingleProduct(data);
        setActiveImage(data.image);
        addViewedProduct(data);
        
        // Fetch Related
        setLoadingRelated(true);
        const related = await getRelatedProductsAPI(id);
        setRelatedProducts(related || []);

        // Fetch Reviews
        const productReviews = await getProductReviewsAPI(id);
        setReviews(productReviews || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
        setLoadingRelated(false);
      }
    };

    fetchProductAndRelated();
    // Reset quantity when id changes
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const data = await addToCartAPI(singleProduct._id, quantity);
      setCart(data);
      toast.success(`${singleProduct.title} added to cart`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        const data = await removeWishlistAPI(singleProduct._id);
        setWishlist(data);
        toast.success("Removed from wishlist");
      } else {
        const data = await addToWishlistAPI(singleProduct._id);
        setWishlist(data);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update wishlist");
    }
  };

  // Review Handlers
  const handleReviewSubmit = async (reviewData) => {
    try {
      if (editingReview) {
        await updateReviewAPI(singleProduct._id, editingReview._id, reviewData);
        toast.success("Review updated!");
      } else {
        await addReviewAPI(singleProduct._id, reviewData);
        toast.success("Review added!");
      }
      setEditingReview(null);
      // Refresh reviews & product data (for updated average rating)
      const [updatedReviews, updatedProduct] = await Promise.all([
        getProductReviewsAPI(id),
        getSingleProduct(id)
      ]);
      setReviews(updatedReviews);
      setSingleProduct(updatedProduct);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReviewAPI(singleProduct._id, reviewId);
      toast.success("Review deleted!");
      // Refresh reviews & product data
      const [updatedReviews, updatedProduct] = await Promise.all([
        getProductReviewsAPI(id),
        getSingleProduct(id)
      ]);
      setReviews(updatedReviews);
      setSingleProduct(updatedProduct);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton type="image" className="h-[500px] rounded-2xl" />
            <div>
              <Skeleton type="title" className="mb-6" />
              <Skeleton type="text" width="40%" className="mb-4" />
              <Skeleton type="text" width="60%" className="mb-8" />
              <Skeleton type="button" className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!singleProduct) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Handle images array if it exists, otherwise just use the main image
  const allImages = singleProduct.images?.length > 0 
    ? [singleProduct.image, ...singleProduct.images] 
    : [singleProduct.image];

  return (
    <MainLayout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          <nav className="flex text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-teal-600">Products</Link>
            <span className="mx-2">/</span>
            {singleProduct.category?.name && (
              <>
                <Link to={`/products?category=${singleProduct.category.name}`} className="hover:text-teal-600">
                  {singleProduct.category.name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-gray-900 truncate max-w-[200px] sm:max-w-xs">{singleProduct.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* IMAGE GALLERY */}
            <div className="flex flex-col gap-4">
              <div className="aspect-w-1 aspect-h-1 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 p-8 flex items-center justify-center">
                <img
                  src={activeImage || singleProduct.image}
                  alt={singleProduct.title}
                  className="max-h-[400px] object-contain mix-blend-multiply"
                />
              </div>
              
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {allImages.map((img, index) => (
                    <div 
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`aspect-w-1 aspect-h-1 rounded-lg border-2 overflow-hidden cursor-pointer p-2 bg-gray-50 flex items-center justify-center ${activeImage === img ? 'border-teal-500' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={img} alt={`Thumbnail ${index}`} className="max-h-20 object-contain mix-blend-multiply" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT INFO */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-teal-600 tracking-wider uppercase">{singleProduct.brand}</span>
                {singleProduct.stock > 0 && singleProduct.stock <= 5 && (
                  <Badge variant="warning">Only {singleProduct.stock} left!</Badge>
                )}
                {singleProduct.stock === 0 && (
                  <Badge variant="danger">Out of Stock</Badge>
                )}
                {singleProduct.stock > 5 && (
                  <Badge variant="success">In Stock</Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{singleProduct.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <StarRating rating={singleProduct.rating} size="md" />
                  <span className="text-sm font-medium text-gray-900 ml-1">{singleProduct.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">{singleProduct.numReviews || 0} Reviews</span>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-6">
                ₹{singleProduct.price.toLocaleString('en-IN')}
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
                {singleProduct.description}
              </p>

              <hr className="border-gray-200 mb-8" />

              {/* ACTIONS */}
              <div className="mt-auto">
                {singleProduct.stock > 0 ? (
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex items-center border border-gray-300 rounded-md bg-white w-full sm:w-32">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3 text-gray-600 hover:text-teal-600 transition-colors focus:outline-none"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={quantity}
                        readOnly
                        className="w-full text-center font-medium text-gray-900 focus:outline-none border-x border-gray-200 py-3"
                      />
                      <button 
                        onClick={() => setQuantity(Math.min(singleProduct.stock, quantity + 1))}
                        className="px-4 py-3 text-gray-600 hover:text-teal-600 transition-colors focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                    
                    <Button 
                      size="lg" 
                      fullWidth 
                      className="flex-1 shadow-md shadow-teal-500/20"
                      onClick={handleAddToCart}
                    >
                      Add To Cart
                    </Button>
                    
                    <button 
                      onClick={handleWishlistToggle}
                      className={`p-3 rounded-md border flex items-center justify-center transition-colors ${
                        isInWishlist 
                          ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100' 
                          : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 bg-white'
                      }`}
                      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-md mb-6 font-medium">
                    This product is currently out of stock. Please check back later.
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    Free Shipping over ₹999
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    30 Days Return
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    24/7 Support
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="mt-16 border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <ReviewList 
                  reviews={reviews} 
                  currentUser={user}
                  onEdit={setEditingReview}
                  onDelete={handleReviewDelete}
                />
              </div>
              
              <div className="lg:col-span-4">
                {user ? (
                  <div className="sticky top-24">
                    <ReviewForm 
                      onSubmit={handleReviewSubmit}
                      initialData={editingReview}
                      onCancel={editingReview ? () => setEditingReview(null) : null}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Write a Review</h3>
                    <p className="text-gray-500 mb-4">Please log in to share your thoughts about this product.</p>
                    <Link to="/login">
                      <Button fullWidth>Log In to Review</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 border-t border-gray-200 pt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;