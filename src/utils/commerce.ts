import { SHIPPING_FEE, SHIPPING_THRESHOLD } from '@/constants/catalog';
import type { Coupon, Product } from '@/types/shop';

/** VND has no fractional minor unit: all amounts are rounded to whole đồng. */
export function checkoutTotals(subtotal: number, percent = 0, hasItems = true) {
  const amount = Math.max(0, Math.round(subtotal));
  const discount = Math.round(amount * Math.max(0, Math.min(percent, 100)) / 100);
  const shipping = !hasItems || amount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal: amount, discount, shipping, total: amount - discount + shipping };
}

export function cartTotals(products: Product[], cart: Record<string, number>, coupon: Coupon | null) {
  const lines = products.filter(p => cart[p.id] > 0);
  const subtotal = lines.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  const scope = coupon?.applicableCategories || [];
  const eligibleAmount = coupon?.active ? lines.filter(p => !scope.length || scope.includes(p.categoryKey || p.category)).reduce((sum, p) => sum + p.price * cart[p.id], 0) : 0;
  // Match the server's per-line eligibility and total percentage calculation.
  const discount = eligibleAmount * Math.max(0, Math.min(coupon?.percent || 0, 100)) / 100;
  const shipping = checkoutTotals(subtotal, 0, !!lines.length).shipping;
  return { subtotal, eligibleAmount, discount, shipping, total: subtotal - discount + shipping };
}
