import React from "react";

type CardColor = "green" | "yellow" | "blue" | "gray" | "red";
type CardSize = "sm" | "md" | "lg";

interface ResultCardProps {
  color?: CardColor;
  size?: CardSize;
  variant?: "default" | "highlight";
  className?: string;
  children: React.ReactNode;
}

const colorClasses: Record<CardColor, string> = {
  green: "bg-green-50 border-green-200",
  yellow: "bg-yellow-50 border-yellow-200",
  blue: "bg-blue-50 border-blue-200",
  gray: "bg-gray-50 border-gray-200",
  red: "bg-red-50 border-red-200",
};

const sizeClasses: Record<CardSize, string> = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function ResultCard({
  color = "gray",
  size = "md",
  variant = "default",
  className = "",
  children,
}: ResultCardProps) {
  const borderWidth = variant === "highlight" ? "border-2" : "border";

  return (
    <div
      className={`rounded-lg ${colorClasses[color]} ${borderWidth} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </div>
  );
}

// Convenience sub-component for common layout patterns
interface ResultCardItemProps {
  label: string;
  value: React.ReactNode;
  layout?: "horizontal" | "vertical";
}

export function ResultCardItem({
  label,
  value,
  layout = "vertical",
}: ResultCardItemProps) {
  if (layout === "horizontal") {
    return (
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">{label}</span>
        {value}
      </div>
    );
  }

  return (
    <div>
      <span className="text-sm text-gray-600 block mb-1">{label}</span>
      {value}
    </div>
  );
}
