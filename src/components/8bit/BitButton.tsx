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
    default: 'bg-[#12122a] text-[#e0e0e0] border-2 border-[#2a2a4a] shadow-[3px_3px_0px_#000] hover:bg-[#1e1e3a] active:shadow-none',
    gold: 'bg-[#ffd700] text-[#0a0a1a] border-2 border-[#cc8800] shadow-[3px_3px_0px_#885500] hover:bg-[#ffee44] active:shadow-none',
    green: 'bg-[#00aa44] text-[#0a0a1a] border-2 border-[#008833] shadow-[3px_3px_0px_#005522] hover:bg-[#00cc55] active:shadow-none',
    red: 'bg-[#cc2222] text-white border-2 border-[#991111] shadow-[3px_3px_0px_#550000] hover:bg-[#ee3333] active:shadow-none',
    ghost: 'bg-transparent text-[#e0e0e0]/40 hover:text-[#e0e0e0] border-2 border-transparent hover:border-[#2a2a4a] shadow-none',
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
