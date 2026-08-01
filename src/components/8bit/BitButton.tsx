import React from 'react';
import { clsx } from 'clsx';

interface BitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'gold' | 'green' | 'red' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export const BitButton: React.FC<BitButtonProps> = ({ 
  variant = 'default', 
  size = 'default', 
  className, 
  children, 
  ...props 
}) => {
  const base = 'retro relative inline-flex items-center justify-center px-4 py-2 text-[10px] uppercase transition-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-30 disabled:cursor-not-allowed';
  
  const variants: Record<string, string> = {
    default: 'bg-lantern-dark/80 text-lantern-parchment border-2 border-lantern-bronze/30 shadow-[3px_3px_0px_rgba(0,0,0,0.4)] hover:bg-lantern-dark/60 active:shadow-none',
    gold: 'bg-lantern-gold text-lantern-dark border-2 border-lantern-gold/50 shadow-[3px_3px_0px_rgba(0,0,0,0.4)] hover:bg-lantern-gold/80 active:shadow-none',
    green: 'bg-lantern-moss text-lantern-dark border-2 border-lantern-moss/50 shadow-[3px_3px_0px_rgba(0,0,0,0.4)] hover:bg-lantern-moss/80 active:shadow-none',
    red: 'bg-lantern-ember text-white border-2 border-lantern-ember/50 shadow-[3px_3px_0px_rgba(0,0,0,0.4)] hover:bg-lantern-ember/80 active:shadow-none',
    ghost: 'bg-transparent text-lantern-parchment/40 hover:text-lantern-parchment border-2 border-transparent hover:border-lantern-bronze/30 shadow-none',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-[8px]',
    default: 'px-4 py-2 text-[10px]',
    lg: 'px-6 py-3 text-xs',
  };

  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {variant !== 'ghost' && (
        <>
          <span className="absolute top-0 left-0 w-1 h-1 bg-current opacity-20" />
          <span className="absolute top-0 right-0 w-1 h-1 bg-current opacity-20" />
          <span className="absolute bottom-0 left-0 w-1 h-1 bg-current opacity-20" />
          <span className="absolute bottom-0 right-0 w-1 h-1 bg-current opacity-20" />
        </>
      )}
      {children}
    </button>
  );
};
