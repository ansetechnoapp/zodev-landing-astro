import React from "react";
import type { ReactNode } from "react";

type PillVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type PillSize = "sm" | "md" | "lg";

interface PillProps {
  children: ReactNode;
  variant?: PillVariant;
  size?: PillSize;
  className?: string;
  onClick?: () => void;
}

const Pill: React.FC<PillProps> = ({ 
  children, 
  variant = "default", 
  size = "md", 
  className = "",
  onClick
}) => {
  // Base classes that will always be applied
  const baseClasses = "flex gap-2 text-white rounded-full whitespace-nowrap items-center";
  
  // Size classes
  const sizeClasses = {
    xs: "px-1 py-1 text-xxs",
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm leading-tight",
    lg: "px-4 py-3 text-lg"
  };
  
  // Variant classes
  const variantClasses = {
    default: "border",
    primary: "border border-blue-500 bg-blue-500",
    secondary: "border border-purple-500 bg-purple-500",
    success: "border border-green-500 bg-green-500",
    warning: "border border-yellow-500 bg-yellow-500 text-gray-800",
    danger: "border border-red-500 bg-red-500"
  };
  
  // Inline styles
  const pillStyle = {
    background: "linear-gradient(rgba(0, 0, 0, 0.1), var(--accent-regular, #ff004f))",
    border: "1px solid var(--accent-regular, #ff004f)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
    padding: "0.5rem 0.75rem"
  };

  // Combine all classes
  const pillClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  return (
    <div 
      className={pillClasses} 
      style={pillStyle}
      onClick={onClick} 
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined} // Add keyboard accessibility
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined} // Handle Enter key
    >
      {children}
    </div>
  );
};

export default Pill;
