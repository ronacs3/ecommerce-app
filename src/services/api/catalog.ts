import type { ApiCategory, ApiProduct } from '@/types/api';
import type { Category, Product } from '@/types/shop';
import { mapCategory, mapProduct } from './adapters';
import { request } from './http';

export async function getCatalog() {
  const [categoryData, productData] = await Promise.all([request<ApiCategory[]>('/categories'), request<ApiProduct[]>('/products')]);
  const categories = categoryData.map(mapCategory);
  return { categories, products: productData.map(p => mapProduct(p, categories)) };
}
export async function getProduct(id: string, categories: Category[]) { return mapProduct(await request<ApiProduct>(`/products/${encodeURIComponent(id)}`), categories); }
export async function saveProduct(product: Product, categories: Category[]) {
  const category = categories.find(c => c.id === product.categoryId || c.label === product.category);
  if (!category) throw new Error('Vui lòng chọn danh mục hợp lệ.');
  const body = { name: product.name.trim(), price: product.price, image: product.image, category: product.categoryKey && product.categoryId === category.id ? product.categoryKey : category.id, countInStock: product.stock, description: product.description?.trim() || '' };
  const result = await request<ApiProduct>(product.id ? `/products/${encodeURIComponent(product.id)}` : '/products', { method: product.id ? 'PUT' : 'POST', auth: true, body });
  return mapProduct(result, categories);
}
export const removeProduct = (id: string) => request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true });
