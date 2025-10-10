'use client';

import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/react-class-names';

const buttonVariants = cva('rounded transition-colors duration-200', {
  variants: {
    variant: {
      default:
        'bg-black text-white/90 hover:text-white disabled:opacity-50 font-poppins font-medium',
      secondary:
        'bg-white text-black/90 hover:text-black disabled:opacity-50 font-poppins font-medium',
    },
    size: {
      default: 'px-4 py-2',
      extraWide: 'px-10 py-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
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
