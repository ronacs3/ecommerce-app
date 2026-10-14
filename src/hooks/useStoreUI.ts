import { StoreUIContext } from '@/contexts/StoreUIContext';
import { useContext } from 'react';

export function useStoreUI() {
  const value = useContext(StoreUIContext);
  if (!value) throw new Error('Missing StoreLayout');
  return value;
}
