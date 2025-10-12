import Link from "next/link";
import { ReactNode } from "react";

import { excali } from "@/fonts";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
} & (
  | {
      href: string;
      onClick?: never;
      type?: never;
    }
  | {
      href?: never;
      onClick: () => void;
      type?: "button" | "submit" | "reset";
    }
);

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = `${excali.className} rounded font-medium transition inline-block`;
  const variantStyles = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  };
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  // Render as Link if href is provided
  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  // Render as button if onClick is provided
  return (
    <button
      onClick={props.onClick}
      type={props.type || "button"}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}
