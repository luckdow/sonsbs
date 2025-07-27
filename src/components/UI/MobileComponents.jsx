import React from 'react';
import { cn } from '../../utils/helpers';

const MobileButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-xl
    transition-all duration-200
    touch-manipulation
    select-none outline-none
    min-h-[48px] min-w-[48px]
    active:scale-98
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:ring-4 focus:ring-offset-2
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600
      text-white shadow-lg
      hover:from-blue-700 hover:to-purple-700
      focus:ring-blue-500/25
      active:shadow-md
    `,
    secondary: `
      bg-gray-100 text-gray-900
      border border-gray-200
      hover:bg-gray-200 hover:border-gray-300
      focus:ring-gray-500/25
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-500
      text-white shadow-lg
      hover:from-green-600 hover:to-emerald-600
      focus:ring-green-500/25
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-rose-500
      text-white shadow-lg
      hover:from-red-600 hover:to-rose-600
      focus:ring-red-500/25
    `,
    outline: `
      border-2 border-blue-600 text-blue-600
      bg-transparent
      hover:bg-blue-50
      focus:ring-blue-500/25
    `,
    ghost: `
      text-gray-600 bg-transparent
      hover:bg-gray-100
      focus:ring-gray-500/25
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
    xl: 'px-10 py-5 text-xl min-h-[64px]'
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    
    // Add visual feedback
    e.currentTarget.style.transform = 'scale(0.98)';
    setTimeout(() => {
      e.currentTarget.style.transform = '';
    }, 150);

    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// Mobile-optimized input component
const MobileInput = ({
  label,
  error,
  helper,
  className = '',
  type = 'text',
  required = false,
  ...props
}) => {
  // Set appropriate input modes for mobile keyboards
  const getInputMode = (type) => {
    switch (type) {
      case 'email': return 'email';
      case 'tel': return 'tel';
      case 'number': return 'numeric';
      case 'url': return 'url';
      case 'search': return 'search';
      default: return 'text';
    }
  };

  const baseInputClasses = `
    w-full px-4 py-3 text-base
    border-2 rounded-xl
    bg-white
    transition-all duration-200
    min-h-[48px]
    touch-manipulation
    focus:outline-none focus:ring-4
    disabled:opacity-50 disabled:bg-gray-50
  `;

  const inputClasses = error
    ? `${baseInputClasses} border-red-300 focus:border-red-500 focus:ring-red-500/25`
    : `${baseInputClasses} border-gray-200 focus:border-blue-500 focus:ring-blue-500/25`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        inputMode={getInputMode(type)}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};

// Mobile-optimized card component
const MobileCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  ...props 
}) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200',
        variants[variant],
        paddings[padding],
        shadows[shadow],
        'touch-manipulation',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { MobileButton, MobileInput, MobileCard };
