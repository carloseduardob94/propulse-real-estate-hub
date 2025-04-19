
import React from "react";

interface LogoProps {
  className?: string;
  textClassName?: string;
  iconOnly?: boolean;
}

export function Logo({ className = "", textClassName = "", iconOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={iconOnly ? "" : "mr-2"}
      >
        <rect width="32" height="32" rx="6" fill="#4b4ae4" />
        <path
          d="M8 9.33333H12L16 22.6667H20L24 9.33333"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 18.6667H25"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      
      {!iconOnly && (
        <span className={`font-bold text-xl text-propulse-800 ${textClassName}`}>
          MeuCorretorPRO
        </span>
      )}
    </div>
  );
}
