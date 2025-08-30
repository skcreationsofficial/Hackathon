import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'text';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  ...rest
}) => {

  const baseClasses = 'rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm py-2 px-4';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-600 text-white hover:bg-gray-400 focus:ring-gray-500 py-2 px-4';
      break;
    case 'success':
      variantClasses = 'bg-green-600 text-white hover:bg-green-400 focus:ring-green-500 py-2 px-4';
      break;
    case 'warning':
      variantClasses = 'bg-yellow-600 text-white hover:bg-yellow-400 focus:ring-yellow-500 py-2 px-4';
      break;
    case 'danger':
      variantClasses = 'bg-red-600 text-white hover:bg-red-400 focus:ring-red-500 py-2 px-4';
      break;
    case 'text':
      variantClasses = 'text-indigo-600 hover:text-black focus:ring-indigo-500 py-1 px-2';
      break;
    default:
      variantClasses = 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm py-2 px-4';
      break;
  }

  const combinedClasses = `${baseClasses} ${variantClasses} ${className || ''}`;

  return (
    <button className={combinedClasses} {...rest}>
      {children}
    </button>
  );
};

export default Button;