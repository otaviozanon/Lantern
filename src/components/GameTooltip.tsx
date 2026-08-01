import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useTooltips } from '../hooks/useTooltips';

interface GameTooltipProps {
  message: string;
  position?: 'top' | 'bottom' | 'left';
  className?: string;
}

export const GameTooltip: React.FC<GameTooltipProps> = ({ message, position = 'bottom', className = '' }) => {
  const { showTooltips } = useTooltips();
  if (!showTooltips) return null;

  const posClass = position === 'top' ? '-top-2 -translate-y-full' : position === 'bottom' ? '-bottom-2 translate-y-full' : 'left-0 -translate-x-full top-1/2 -translate-y-1/2';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`absolute ${posClass} left-1/2 -translate-x-1/2 z-[400] pointer-events-none ${className}`}
      >
        <div className="bg-lantern-gold/90 text-lantern-dark px-3 py-1.5 rounded-lg text-[10px] font-body leading-relaxed whitespace-nowrap shadow-lg text-center max-w-[200px]">
          <Icon icon="pixelarticons:info-box" className="inline w-3 h-3 mr-1 -mt-0.5" />
          {message}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-lantern-gold/90 rotate-45" style={{ [position === 'top' ? 'bottom' : 'top']: '-4px' }} />
      </motion.div>
    </AnimatePresence>
  );
};
