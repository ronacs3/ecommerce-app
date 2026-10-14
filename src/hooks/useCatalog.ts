import { filterCatalog, type CatalogOptions } from '@/utils/catalog';
import { useShop } from './useShop';

export function useCatalog(options: CatalogOptions) {
  const shop = useShop();
  return filterCatalog(shop.products, shop.favorites, options);
}
