import { Link } from "react-router";
import StarRating from "../ui/StarRating";
import Badge from "../ui/Badge";

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white border border-obsidian-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full relative hover:border-accent-500/30">
      
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
      <div className="relative h-64 overflow-hidden bg-obsidian-100/30 flex items-center justify-center p-6 border-b border-obsidian-200/50">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-500"
        />
        
        {/* QUICK ACTION OVERLAY */}
        <div className="absolute inset-0 bg-obsidian-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs">
          <Link
            to={`/products/${product._id}`}
            className="bg-accent-500 text-obsidian-950 px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-accent-600 transition-all duration-200 text-xs tracking-wider uppercase active:scale-95"
          >
            Quick View
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-obsidian-400">
            {product.brand}
          </span>
        </div>
        
        <Link to={`/products/${product._id}`} className="mb-1.5 group-hover:text-accent-700 transition-colors">
          <h3 className="text-sm font-bold text-obsidian-950 line-clamp-1 leading-snug" title={product.title}>
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1.5 mb-4">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-[10px] font-bold text-obsidian-450">({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-obsidian-100">
          <span className="text-base font-black text-obsidian-950">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[9px] font-bold text-accent-700 uppercase tracking-widest bg-accent-500/10 px-2.5 py-1 rounded border border-accent-500/20 shadow-xs">
            SECURE COD
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;