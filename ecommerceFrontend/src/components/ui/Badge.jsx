import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    info: "bg-primary-50 text-primary-700 border-primary-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-250",
    warning: "bg-accent-50 text-accent-700 border-accent-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    default: "bg-obsidian-100/50 text-obsidian-600 border-obsidian-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
