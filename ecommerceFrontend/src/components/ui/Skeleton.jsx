import React from 'react';

const Skeleton = ({ className = '', type = 'text', width, height }) => {
  const baseClasses = "animate-pulse bg-linear-to-r from-gray-200 via-gray-150 to-gray-200 bg-[length:200%_auto] rounded-xl";
  
  const typeClasses = {
    text: "h-4 w-3/4",
    title: "h-6 w-1/2 mb-4",
    image: "h-48 w-full",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24",
    card: "h-64 w-full"
  };

  const customStyle = {};
  if (width) customStyle.width = width;
  if (height) customStyle.height = height;

  return (
    <div 
      className={`${baseClasses} ${typeClasses[type]} ${className}`}
      style={customStyle}
    ></div>
  );
};

export default Skeleton;
