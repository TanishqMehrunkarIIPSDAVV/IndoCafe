import { createContext, useContext } from 'react';

export const OutletContext = createContext();

export const useOutlet = () => {
  return useContext(OutletContext);
};
