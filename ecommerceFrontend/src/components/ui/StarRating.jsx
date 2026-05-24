import React from 'react';

const StarRating = ({ rating, count = 5, size = 'md', className = '' }) => {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const getStarColor = (index) => {
    if (rating >= index + 1) return "text-yellow-400";
    if (rating >= index + 0.5) return "text-yellow-400"; // Can use a half-star SVG here if needed
    return "text-gray-300";
  };

  return (
    <div className={`flex items-center ${sizes[size]} ${className}`}>
      {[...Array(count)].map((_, i) => (
        <span key={i} className={getStarColor(i)}>
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
