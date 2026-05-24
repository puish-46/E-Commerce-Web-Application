import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Merchant Grid</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Your premium destination for quality products. We deliver excellence directly to your doorstep.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-teal-400 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-teal-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-teal-400 transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=Books" className="hover:text-teal-400 transition-colors">Books</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/my-orders" className="hover:text-teal-400 transition-colors">Order Track</Link></li>
              <li><Link to="/profile" className="hover:text-teal-400 transition-colors">My Account</Link></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-3">Subscribe to get special offers and updates.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-teal-500 border border-gray-700"
              />
              <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Merchant Grid. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;