import { ShopContext } from '@/contexts/ShopContext';
import { useContext } from 'react';

export function useShop() { const value = useContext(ShopContext); if (!value) throw new Error('Missing StoreProvider'); return value; }
