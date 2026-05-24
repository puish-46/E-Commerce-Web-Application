import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    info: "bg-blue-50/70 text-blue-700 border-blue-100",
    success: "bg-emerald-50/70 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50/70 text-amber-700 border-amber-100",
    danger: "bg-rose-50/70 text-rose-750 border-rose-100",
    default: "bg-gray-50/70 text-gray-600 border-gray-150",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
