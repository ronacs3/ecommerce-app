import { initialState } from '@/data/shop-state';
import { loadShopState,saveShopState } from '@/services/shopStorage';
import type { Order,Shop,State } from '@/types/shop';
import { checkoutTotals } from '@/utils/commerce';
import React,{ useEffect,useState } from 'react';
import { ShopContext } from './ShopContext';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    // Read external storage after hydration; never overwrite it with initial state.
    Promise.resolve().then(() => {
      if (cancelled) return;
      setState(loadShopState(initialState));
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => { if (ready) saveShopState(state); }, [state, ready]);
  const shop: Shop = {
    ...state, ready,
    applyCoupon(code) { const valid = state.coupons.some(c => c.active && c.code === code); setState(s => ({ ...s, discountCode: valid ? code : '' })); return valid; },
    add(id) { const p = state.products.find(p => p.id === id); if (!p || (state.cart[id] || 0) >= p.stock) return false; setState(s => ({ ...s, cart: { ...s.cart, [id]: Math.min((s.cart[id] || 0) + 1, p.stock) } })); return true; },
    quantity(id, value) { setState(s => { const cart = { ...s.cart }; const stock = s.products.find(p => p.id === id)?.stock || 0; if (value <= 0 || stock === 0) delete cart[id]; else cart[id] = Math.min(value, stock); return { ...s, cart }; }); },
    favorite(id) { setState(s => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter(n => n !== id) : [...s.favorites, id] })); },
    updateProduct(product) { setState(s => ({ ...s, products: s.products.some(p => p.id === product.id) ? s.products.map(p => p.id === product.id ? product : p) : [...s.products, product], cart: s.cart[product.id] ? { ...s.cart, [product.id]: Math.min(s.cart[product.id], product.stock) } : s.cart })); },
    deleteProduct(id) { setState(s => { const cart = { ...s.cart }; delete cart[id]; return { ...s, products: s.products.filter(p => p.id !== id), favorites: s.favorites.filter(n => n !== id), cart }; }); },
    updateCoupon(coupon) { setState(s => ({ ...s, coupons: s.coupons.some(c => c.code === coupon.code) ? s.coupons.map(c => c.code === coupon.code ? coupon : c) : [...s.coupons, coupon] })); },
    updateOrder(id, status) { setState(s => ({ ...s, orders: s.orders.map(o => o.id === id ? { ...o, status } : o) })); },
    placeOrder(details, code) {
      const lines = state.products.filter(p => state.cart[p.id] > 0);
      if (!lines.length || lines.some(p => state.cart[p.id] > p.stock)) return null;
      const subtotal = lines.reduce((sum, p) => sum + p.price * state.cart[p.id], 0);
      const discount = state.coupons.find(c => c.active && c.code === code)?.percent || 0;
      const order: Order = { ...details, id: `FF-${Date.now().toString().slice(-8)}`, total: checkoutTotals(subtotal, discount).total, status: 'Processing', date: new Date().toISOString(), items: lines.map(p => ({ name: p.name, quantity: state.cart[p.id] })) };
      setState(s => ({ ...s, cart: {}, discountCode: '', orders: [order, ...s.orders], products: s.products.map(p => ({ ...p, stock: p.stock - (s.cart[p.id] || 0) })) }));
      return order;
    },
  };
  return <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>;
}
