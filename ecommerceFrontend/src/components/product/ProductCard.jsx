import { Link } from "react-router";
import StarRating from "../ui/StarRating";
import Badge from "../ui/Badge";

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
      
      {/* BADGES */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="warning">Low Stock</Badge>
        )}
        {product.stock === 0 && (
          <Badge variant="danger">Out of Stock</Badge>
        )}
      </div>

      {/* IMAGE CONTAINER */}
      <div className="relative h-64 overflow-hidden bg-gray-50/50 flex items-center justify-center p-6 border-b border-gray-100/50">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-103 transition-transform duration-500"
        />
        
        {/* QUICK ACTION OVERLAY */}
        <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs">
          <Link
            to={`/products/${product._id}`}
            className="bg-white text-gray-900 px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-teal-50 hover:text-teal-700 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-sm active:scale-95"
          >
            Quick View
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {product.brand}
          </span>
        </div>
        
        <Link to={`/products/${product._id}`} className="mb-1.5 group-hover:text-teal-650 transition-colors">
          <h3 className="text-base font-bold text-gray-900 line-clamp-1 leading-snug" title={product.title}>
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1.5 mb-4">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-[10px] font-bold text-gray-400">({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-lg font-black text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
            Secure COD
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;