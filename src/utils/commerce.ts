export function checkoutTotals(subtotal: number, percent = 0, hasItems = true) {
  const subtotalCents = Math.round(subtotal * 100);
  const discountCents = Math.round(subtotalCents * Math.max(0, Math.min(percent, 90)) / 100);
  const shippingCents = !hasItems || subtotalCents >= 15000 ? 0 : 1200;
  return { subtotal: subtotalCents / 100, discount: discountCents / 100, shipping: shippingCents / 100, total: (subtotalCents - discountCents + shippingCents) / 100 };
}
