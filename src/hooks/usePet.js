import { useContext } from 'react';
import { PetContext } from '../context/PetContextValue';

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet debe usarse dentro de un PetProvider');
  }
  return context;
};
