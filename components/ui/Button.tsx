'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variant === 'primary' && "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        variant === 'secondary' && "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}