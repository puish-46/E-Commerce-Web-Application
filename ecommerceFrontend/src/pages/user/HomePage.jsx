import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import MainLayout from "../../layouts/MainLayout";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/product/ProductCard";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch new arrivals
        const newestData = await getProducts({ limit: 8, sort: 'newest' });
        setFeaturedProducts(newestData.products || []);

        // Fetch top rated
        const topRatedData = await getProducts({ limit: 8, sort: 'rating' });
        setTopRatedProducts(topRatedData.products || []);
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const categories = [
    { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80", link: "/products?category=Electronics", desc: "Premium Gadgets" },
    { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80", link: "/products?category=Fashion", desc: "Curated Style" },
    { name: "Home & Garden", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80", link: "/products?category=Home & Garden", desc: "Living Spaces" },
    { name: "Sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80", link: "/products?category=Sports", desc: "Peak Action" },
  ];

  return (
    <MainLayout>
      {/* PREMIUM HERO SECTION */}
      <section className="relative bg-slate-950 text-white overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-25 scale-105 motion-safe:animate-[pulse_8s_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-transparent"></div>
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-start justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold mb-6 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
            New Arrivals Collection 2026
          </div>
          <h1 className="text-4xl md:text-7xl font-sans font-extrabold mb-6 max-w-3xl leading-tight tracking-tight">
            Discover Premium Goods For Your Lifestyle.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-light leading-relaxed">
            Experience premium curated products, elite customer care, and quick free shipping on all orders over ₹999.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" onClick={() => navigate('/products')} className="px-10 shadow-lg shadow-teal-500/20">
              Explore Shop
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/products?sort=rating')} className="bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-xs">
              View Top Rated
            </Button>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
              <p className="text-gray-500 mt-2 text-sm md:text-base">Find exactly what matches your premium criteria.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link}
                className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Visual Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
                  <span className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.desc}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-teal-350 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS GRID */}
      <section className="py-20 bg-gray-50/60 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">New Arrivals</h2>
              <p className="text-gray-500 mt-2 text-sm">Explore our brand new additions to the collection.</p>
            </div>
            <Link to="/products?sort=newest" className="text-teal-650 font-bold hover:text-teal-700 text-sm hidden sm:flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} type="card" className="rounded-2xl h-80 animate-pulse" />)
            ) : (
              featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* NEWSLETTER BANNER */}
      <section className="py-16 bg-slate-950 text-white relative overflow-hidden border-y border-slate-800">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">Join Our Exclusive Newsletter</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            Get 10% off your first checkout and unlock early previews for elite collections.
          </p>
          <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your professional email" 
              className="px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-teal-500/25 border border-slate-800 focus:border-teal-500 text-sm text-gray-900 bg-white"
            />
            <button className="bg-teal-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-teal-700 active:scale-[0.98] transition-all duration-200 whitespace-nowrap shadow-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* TOP RATED GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Best Sellers</h2>
              <p className="text-gray-500 mt-2 text-sm">Shop our client favorites and top-rated catalog items.</p>
            </div>
            <Link to="/products?sort=rating" className="text-teal-655 font-bold hover:text-teal-700 text-sm hidden sm:flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} type="card" className="rounded-2xl h-80 animate-pulse" />)
            ) : (
              topRatedProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;