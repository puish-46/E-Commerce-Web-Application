import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  id,
  options = [],
  error,
  className = '',
  placeholder,
  ...props
}, ref) => {
  return (
    <div className={`mb-4 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`
          block w-full rounded-md shadow-sm sm:text-sm px-4 py-2 border bg-white
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
          transition-colors
          ${error ? 'border-red-300 text-red-900' : 'border-gray-300'}
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
