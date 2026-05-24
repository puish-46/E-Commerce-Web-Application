import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  id,
  type = 'text',
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`mb-4 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-widest text-obsidian-500 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`
          block w-full rounded-xl shadow-xs text-sm px-4 py-3 border
          focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500
          transition-all duration-200 bg-obsidian-100/10 placeholder-obsidian-400 text-obsidian-900 border-obsidian-200
          ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/10' : 'hover:border-obsidian-300'}
          disabled:bg-obsidian-100 disabled:text-obsidian-400 disabled:cursor-not-allowed
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-500" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
