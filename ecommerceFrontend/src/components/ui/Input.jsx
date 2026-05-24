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
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`
          block w-full rounded-xl shadow-xs text-sm px-4 py-3 border
          focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500
          transition-all duration-200 bg-gray-50/20 placeholder-gray-400
          ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500/25 focus:border-red-500 bg-red-50/10' : 'border-gray-255 hover:border-gray-300'}
          disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
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
