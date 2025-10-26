"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type Size = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  text?: string;
  size?: Size;
  className?: string;
}

const sizeClass = (size: Size | undefined) => {
  switch (size) {
    case "sm":
      return "w-4 h-4";
    case "lg":
      return "w-8 h-8";
    case "md":
    default:
      return "w-5 h-5";
  }
};

export function LoadingSpinner({ text, size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClass(size)} animate-spin text-current`} />
      {text ? <span className="text-sm">{text}</span> : null}
    </div>
  );
}

export default LoadingSpinner;
