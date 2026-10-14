import type { Shop } from '@/types/shop';
import { createContext } from 'react';

export const ShopContext = createContext<Shop | null>(null);
