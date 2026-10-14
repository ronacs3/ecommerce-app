import type { ApiOrder, ApiUser } from '@/types/api';
import type { CheckoutDetails, DashboardStats, OrderAction, Product, User } from '@/types/shop';
import { mapOrder, mapUser } from './adapters';
import { request } from './http';

export async function getOrders(user: User) {
  const data = await request<ApiOrder[]>(user.isAdmin ? '/orders' : '/orders/myorders', { auth: true });
  return data.map(o => mapOrder(o, user.isAdmin ? null : user));
}
export async function createOrder(details: CheckoutDetails, lines: { product: Product; quantity: number }[], shipping: number, coupon: string, user: User) {
  const body = { orderItems: lines.map(({ product, quantity }) => ({ product: product.id, name: product.name, image: product.image, price: product.price, qty: quantity })), shippingAddress: { address: details.address.trim(), city: details.city.trim(), postalCode: details.postalCode.trim(), country: details.country.trim() }, paymentMethod: details.payment, taxPrice: 0, shippingPrice: shipping, ...(coupon ? { couponCode: coupon } : {}) };
  return mapOrder(await request<ApiOrder>('/orders', { method: 'POST', body, auth: true, timeout: 60000 }), user);
}
export async function changeOrder(id: string, action: OrderAction, user: User) {
  const data = await request<ApiOrder | { order: ApiOrder }>(`/orders/${encodeURIComponent(id)}/${action}`, { method: 'PUT', auth: true, timeout: 60000 });
  return mapOrder('order' in data ? data.order : data, user);
}
export const getStats = () => request<DashboardStats>('/orders/stats', { auth: true });
export async function getUsers() { return (await request<ApiUser[]>('/users', { auth: true })).map(mapUser); }
