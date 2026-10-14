import { useShop } from './useShop';

type CatalogOptions = {
  category?: string;
  filter?: string;
  search: string;
  sort: string;
  wishlist: boolean;
};

export function useCatalog({ category, filter, search, sort, wishlist }: CatalogOptions) {
  const shop = useShop();
  let products = shop.products.filter(p =>
    (!category || p.category === category) &&
    (!search || `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())) &&
    (!wishlist || shop.favorites.includes(p.id)) &&
    (filter !== 'new' || p.tag === 'New')
  );
  if (sort === 'Price: low to high') products = [...products].sort((a, b) => a.price - b.price);
  if (sort === 'Price: high to low') products = [...products].sort((a, b) => b.price - a.price);
  return products;
}
