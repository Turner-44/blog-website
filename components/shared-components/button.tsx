'use client';

import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/react-class-names';

const buttonVariants = cva('rounded transition-colors duration-200', {
  variants: {
    variant: {
      default:
        'bg-black text-white/90 hover:text-white disabled:opacity-50 cursor-pointer',
      secondary:
        'bg-white text-black/90 hover:text-black disabled:opacity-50 cursor-pointer',
    },
    size: {
      default: 'px-4 py-2',
      extraWide: 'px-10 py-3',
    },
    font: {
      default: 'font-poppins font-medium',
      bold: 'font-poppins font-bold',
      semibold: 'font-poppins font-semibold',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    font: 'default',
  },
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button: React.FC<ButtonProps> = ({
  className,
  size,
  variant,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ size, variant, className }))}
      {...props}
    >
      {props.children}
    </button>
  );
};

Button.displayName = 'Button';

export { Button, buttonVariants };
