import React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const buttonVariants = cva(
  'relative group border text-foreground mx-auto text-center rounded-full transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-orange-500/5 hover:bg-orange-500/10 border-orange-500/25',
        solid: 'bg-orange-500 hover:bg-orange-400 text-black border-transparent font-bold',
        ghost: 'border-transparent bg-transparent hover:border-orange-500/40 hover:bg-orange-500/5',
      },
      size: {
        default: 'px-7 py-2.5 text-sm',
        sm: 'px-4 py-1.5 text-xs',
        lg: 'px-10 py-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  neon?: boolean;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, neon = true, size, variant, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {neon && (
          <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-orange-400 to-transparent" />
        )}
        {children}
        {neon && (
          <span className="absolute group-hover:opacity-40 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-orange-400 to-transparent" />
        )}
        {neon && variant === 'solid' && (
          <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 blur-md bg-orange-500/30" />
        )}
      </button>
    );
  }
);

NeonButton.displayName = 'NeonButton';
export { NeonButton, buttonVariants };
