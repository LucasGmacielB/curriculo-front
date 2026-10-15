import { useContext } from 'react';

import { PortfolioContext, type PortfolioContextValue } from '@/contexts/PortfolioContext';

export function usePortfolio(): PortfolioContextValue {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio deve ser utilizado dentro de PortfolioProvider.');
  return context;
}
