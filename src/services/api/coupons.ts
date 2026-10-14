import type { ApiCoupon } from '@/types/api';
import type { Coupon, Product } from '@/types/shop';
import { mapCoupon } from './adapters';
import { request } from './http';

export async function validateCoupon(code: string, products: Product[]) {
  return mapCoupon(await request<ApiCoupon>('/coupons/validate', { method: 'POST', body: { code: code.trim().toUpperCase(), cartItems: products.map(p => ({ category: p.categoryKey || p.category })) } }));
}
export async function getCoupons() { return (await request<ApiCoupon[]>('/coupons', { auth: true })).map(mapCoupon); }
export async function createCoupon(coupon: Coupon) {
  return mapCoupon(await request<ApiCoupon>('/coupons', { method: 'POST', auth: true, body: { code: coupon.code, discount: coupon.percent, expirationDate: coupon.expirationDate, applicableCategories: coupon.applicableCategories || [] } }));
}
export const removeCoupon = (id: string) => request(`/coupons/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true });
