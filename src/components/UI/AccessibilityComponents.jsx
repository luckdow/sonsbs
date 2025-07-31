import React from 'react';

/**
 * Erişilebilir Buton Komponenti
 * WCAG 2.1 standartlarına uygun buton komponenti
 */
const AccessibleButton = ({ 
  children, 
  onClick, 
  ariaLabel,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  className = '',
  type = 'button',
  ariaDescribedBy,
  ariaExpanded,
  ariaHaspopup,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  const buttonClasses = [
    baseClasses,
    variants[variant],
    sizes[size],
    className
  ].join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Erişilebilir Başlık Komponenti
 * Doğru başlık hiyerarşisi sağlar
 */
const AccessibleHeading = ({ 
  level = 1, 
  children, 
  className = '',
  id,
  ...props 
}) => {
  const HeadingTag = `h${level}`;
  
  const defaultClasses = {
    1: 'text-3xl font-bold',
    2: 'text-2xl font-semibold', 
    3: 'text-xl font-semibold',
    4: 'text-lg font-medium',
    5: 'text-base font-medium',
    6: 'text-sm font-medium'
  };
  
  const headingClasses = [
    defaultClasses[level],
    className
  ].join(' ');

  return React.createElement(
    HeadingTag,
    {
      className: headingClasses,
      id,
      ...props
    },
    children
  );
};

/**
 * Skip Link Komponenti
 * Klavye kullanıcıları için ana içeriğe geçiş linki
 */
const SkipLink = ({ href = '#main-content', children = 'Ana içeriğe geç' }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </a>
  );
};

export { AccessibleButton, AccessibleHeading, SkipLink };
