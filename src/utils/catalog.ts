import type { Product } from '@/types/shop';

export type CatalogOptions = {
  category?: string;
  filter?: string;
  search: string;
  sort: string;
  wishlist: boolean;
  min?: string;
  max?: string;
};

function normalizeSearch(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

export function filterCatalog(catalog: Product[], favorites: string[], { category, filter, search, sort, wishlist, min, max }: CatalogOptions) {
  const keyword = normalizeSearch(search.trim());
  let products = catalog.filter(p =>
    (!category || p.category === category) &&
    (!keyword || normalizeSearch(`${p.name} ${p.category}`).includes(keyword)) &&
    (!wishlist || favorites.includes(p.id)) &&
    (filter !== 'new' || p.tag === 'Mới') &&
    (min === undefined || !Number.isFinite(Number(min)) || p.price >= Number(min)) &&
    (max === undefined || !Number.isFinite(Number(max)) || p.price <= Number(max))
  );
  if (sort === 'Price: low to high') products = products.sort((a, b) => a.price - b.price);
  if (sort === 'Price: high to low') products = products.sort((a, b) => b.price - a.price);
  return products;
}
