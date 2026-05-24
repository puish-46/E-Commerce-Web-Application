import { useState, useEffect } from 'react';

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error("Could not parse recently viewed items");
      }
    }
  }, []);

  const addViewedProduct = (product) => {
    if (!product || !product._id) return;
    
    setRecentlyViewed((prev) => {
      // Remove if it already exists to put it at the front
      const filtered = prev.filter(p => p._id !== product._id);
      
      // Keep only essential info to save localStorage space
      const newProduct = {
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        rating: product.rating,
      };
      
      const updated = [newProduct, ...filtered].slice(0, 8); // Keep last 8
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  return { recentlyViewed, addViewedProduct };
}
