import Link from 'next/link';

import { excali } from '@/fonts';

import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
} & (
  | { type: 'submit' | 'reset' | 'button'; onClick?: never; href?: never }
  | { href: string; onClick?: never; type?: never }
  | { href?: never; onClick: () => void; type?: 'button' | 'submit' | 'reset' }
);

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  // Text variant uses different base styles
  const baseStyles =
    variant === 'text'
      ? 'font-semibold transition inline-block cursor-pointer'
      : `${excali.className} rounded font-medium transition inline-block`;

  const variantStyles = {
    primary: disabled
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-yellow-400 text-black hover:bg-yellow-500',
    secondary: disabled
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    text: disabled
      ? 'text-gray-400 cursor-not-allowed'
      : 'text-[#713f12] hover:text-[#a16207]',
  };

  const sizeStyles =
    variant === 'text'
      ? {
          sm: 'text-xs',
          md: 'text-sm',
          lg: 'text-base',
        }
      : {
          sm: 'px-4 py-2 text-sm',
          md: 'px-6 py-3 text-base',
          lg: 'px-8 py-4 text-lg',
        };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  // Render as Link if href is provided
  if ('href' in props && props.href) {
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
      type={props.type || 'button'}
      disabled={disabled}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}
