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
    { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80", link: "/products?category=Electronics", desc: "Elite Tech" },
    { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80", link: "/products?category=Fashion", desc: "Haute Couture" },
    { name: "Home & Garden", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80", link: "/products?category=Home & Garden", desc: "Living Spaces" },
    { name: "Sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80", link: "/products?category=Sports", desc: "High Performance" },
  ];

  return (
    <MainLayout>
      {/* CINEMATIC HERO SECTION */}
      <section className="relative bg-obsidian-950 text-white overflow-hidden min-h-[620px] flex items-center border-b border-obsidian-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20 scale-105 motion-safe:animate-[pulse_10s_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-obsidian-950 via-obsidian-900/95 to-transparent"></div>
          
          {/* Ambient Gold Radial Glows */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 flex flex-col items-start justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-500 text-[10px] font-bold uppercase tracking-widest mb-6 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-ping"></span>
            Aurelian Luxury Edition 2026
          </div>
          <h1 className="text-4xl md:text-7xl font-sans font-extrabold mb-6 max-w-3xl leading-tight tracking-tight text-white">
            Futuristic Design.<br />
            <span className="bg-gradient-to-r from-accent-500 via-accent-600 to-primary-400 bg-clip-text text-transparent">
              Luxury Craftsmanship.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-obsidian-300 mb-10 max-w-2xl font-light leading-relaxed">
            Discover a curated universe of premium products. Uncompromised details, elite checkout flows, and free logistics above ₹999.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" onClick={() => navigate('/products')} className="px-10 shadow-lg shadow-accent-500/20 bg-accent-500 text-obsidian-950 hover:bg-accent-600 focus:ring-accent-500">
              Explore Collection
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/products?sort=rating')} className="bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-xs">
              View Best Sellers
            </Button>
          </div>
        </div>
      </section>

      {/* LUXURY SHOP BY CATEGORY */}
      <section className="py-24 bg-white border-b border-obsidian-105">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-600 mb-2 block">Curated Portfolios</span>
              <h2 className="text-3xl font-extrabold text-obsidian-950 tracking-tight">Shop by Category</h2>
              <p className="text-obsidian-500 mt-2 text-sm md:text-base">Find exactly what matches your elite criteria.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                {/* Visual Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/30 to-transparent flex flex-col justify-end p-6">
                  <span className="text-accent-500 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.desc}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-accent-200 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LUXURY NEW ARRIVALS GRID */}
      <section className="py-24 bg-obsidian-50/20 border-b border-obsidian-105">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-600 mb-2 block">Fresh In Store</span>
              <h2 className="text-3xl font-extrabold text-obsidian-950 tracking-tight">New Arrivals</h2>
              <p className="text-obsidian-500 mt-2 text-sm">Explore our brand new additions to the collection.</p>
            </div>
            <Link to="/products?sort=newest" className="text-accent-700 font-bold hover:text-accent-800 text-xs uppercase tracking-widest flex items-center gap-1">
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

      {/* OBSIDIAN NEWSLETTER BANNER */}
      <section className="py-20 bg-obsidian-950 text-white relative overflow-hidden border-y border-obsidian-800 shadow-inner">
        {/* Subtle glowing elements */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary-600/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-accent-500/10 border border-accent-500/20 text-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-accent-500/5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">Join Our Exclusive VIP Circle</h2>
          <p className="text-obsidian-400 mb-8 max-w-xl mx-auto text-sm leading-relaxed font-light">
            Receive 10% off your next checkout and gain privileged early access to limited luxury collections.
          </p>
          <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your professional email" 
              className="px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-accent-500/20 border border-obsidian-850 focus:border-accent-500 text-sm text-gray-900 bg-white"
            />
            <button className="bg-accent-500 text-obsidian-950 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-accent-600 active:scale-[0.97] transition-all duration-200 whitespace-nowrap shadow-md shadow-accent-500/10">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* LUXURY BEST SELLERS GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-600 mb-2 block">Customer Favorites</span>
              <h2 className="text-3xl font-extrabold text-obsidian-950 tracking-tight">Best Sellers</h2>
              <p className="text-obsidian-500 mt-2 text-sm">Shop our client favorites and top-rated catalog items.</p>
            </div>
            <Link to="/products?sort=rating" className="text-accent-700 font-bold hover:text-accent-800 text-xs uppercase tracking-widest flex items-center gap-1">
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