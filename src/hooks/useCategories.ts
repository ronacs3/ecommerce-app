import { useShop } from './useShop';

export function useCategories() {
  return useShop().categories.map(c => c.label);
}
