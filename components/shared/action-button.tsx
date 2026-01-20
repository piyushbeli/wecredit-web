'use client';

/**
 * ActionButton Component
 * A highly customizable button component using WeCredit brand colors.
 */

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Button, type buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Icon to display on the left side of the text */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side of the text */
  rightIcon?: React.ReactNode;
  /** Whether the button should take up the full width of its container */
  fullWidth?: boolean;
  /** Additional classes for the button */
  className?: string;
}

/**
 * ActionButton provides a consistent brand-styled button with 
 * built-in loading and icon support.
 */
const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      children,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      variant = 'default',
      size = 'default',
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'relative font-semibold transition-all duration-200 active:scale-[0.98]',
          variant === 'default' && 'bg-brand-primary hover:bg-brand-primary/90 text-white! shadow-md hover:shadow-lg',
          fullWidth && 'w-full',
          className
        )}
        variant={variant}
        size={size}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
        )}
        
        {!isLoading && leftIcon && (
          <span className="mr-2 inline-flex shrink-0">{leftIcon}</span>
        )}
        
        <span className={cn(isLoading ? 'opacity-90' : 'opacity-100')}>
          {children}
        </span>
        
        {!isLoading && rightIcon && (
          <span className="ml-2 inline-flex shrink-0">{rightIcon}</span>
        )}
      </Button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
