import type { Product } from '@/types/shop';
import { createContext } from 'react';

export type StoreUI = {
  compact: boolean;
  go: (route: string) => void;
  notify: (message: string) => void;
  setSelected: (product: Product | null) => void;
  add: (product: Product) => void;
  search: string;
  setSearch: (search: string) => void;
  sort: string;
  setSort: (sort: string) => void;
};

export const StoreUIContext = createContext<StoreUI | null>(null);
