import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-xs uppercase tracking-wider text-xs";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg hover:shadow-primary-600/20 focus:ring-primary-500 border border-transparent",
    secondary: "bg-obsidian-950 hover:bg-obsidian-900 text-accent-500 border border-accent-500/30 focus:ring-accent-500 shadow-md shadow-accent-500/5",
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 border border-transparent",
    ghost: "bg-transparent text-obsidian-500 hover:bg-obsidian-100 hover:text-obsidian-900 focus:ring-obsidian-400 border border-transparent",
    glass: "backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-xs focus:ring-white",
  };
  
  const sizes = {
    sm: "px-4 py-2.5 text-[10px]",
    md: "px-6 py-3.5 text-xs",
    lg: "px-8 py-4 text-sm",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
