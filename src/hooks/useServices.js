import { useContext } from 'react';
import { ServicesContext } from '../context/ServicesContextValue';

export const useServices = () => {
  const context = useContext(ServicesContext);
  
  if (!context) {
    throw new Error('useServices debe ser usado dentro de un ServicesProvider');
  }
  
  return context;
};
