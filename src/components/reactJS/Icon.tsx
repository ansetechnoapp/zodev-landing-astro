import React from "react";
import { iconPaths } from "../IconPaths";
import "../../styles/Icon.css";

interface IconProps {
  icon: keyof typeof iconPaths;
  color?: string;
  gradient?: boolean;
  size?: string;
}

const Icon: React.FC<IconProps> = ({
  color = "currentcolor",
  gradient,
  icon,
  size,
}) => {
  // Generate a unique ID for the gradient to avoid conflicts when using multiple icons
  const gradientId = `icon-gradient-${Math.round(Math.random() * 10e12).toString(36)}`;

  // Set up the style object for the SVG, applying the size as a CSS variable if provided
  const svgStyle = size ? { "--size": size } as React.CSSProperties : {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 256 256"
      aria-hidden="true"
      stroke={gradient ? `url(#${gradientId})` : color}
      fill={gradient ? `url(#${gradientId})` : color}
      style={svgStyle}
      className="icon"
    >
      {/* Render the icon path using dangerouslySetInnerHTML */}
      <g dangerouslySetInnerHTML={{ __html: iconPaths[icon] }} />

      {/* Conditionally render the gradient if the gradient prop is true */}
      {gradient && (
        <linearGradient
          id={gradientId}
          x1="23"
          x2="235"
          y1="43"
          y2="202"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--gradient-stop-1)" />
          <stop offset=".5" stopColor="var(--gradient-stop-2)" />
          <stop offset="1" stopColor="var(--gradient-stop-3)" />
        </linearGradient>
      )}
    </svg>
  );
};

export default Icon;