import React, { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;  // This will allow the card to accept any nested content
  className?: string;   // Allow custom styles or classes
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;