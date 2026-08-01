import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface TooltipContextType {
  showTooltips: boolean;
  toggleTooltips: () => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const TooltipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showTooltips, setShowTooltips] = useState(false);
  const toggleTooltips = useCallback(() => setShowTooltips(p => !p), []);
  return (
    <TooltipContext.Provider value={{ showTooltips, toggleTooltips }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltips = () => {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error('useTooltips must be used within TooltipProvider');
  return ctx;
};
