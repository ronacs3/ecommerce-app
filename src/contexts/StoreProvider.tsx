import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { initialState } from '@/data/shop-state';
import { loadPreferences, savePreferences } from '@/services/shopStorage';
import { getCatalog, getProduct, removeProduct, saveProduct } from '@/services/api/catalog';
import { createCoupon, getCoupons, removeCoupon, validateCoupon } from '@/services/api/coupons';
import { changeOrder, createOrder, getOrders, getStats, getUsers } from '@/services/api/orders';
import { errorMessage } from '@/services/api/http';
import { cartTotals } from '@/utils/commerce';
import type { Coupon, DashboardStats, Shop, State, User } from '@/types/shop';
import { ShopContext } from './ShopContext';

export function StoreProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mutating, setMutating] = useState(false);
  const [privateLoading, setPrivateLoading] = useState(false);
  const [privateError, setPrivateError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const mutationLock = useRef(false);
  const catalogGeneration = useRef(0);
  const privateGeneration = useRef(0);
  const currentUser = useRef<User | null>(null);
  useEffect(() => { currentUser.current = auth.user; }, [auth.user]);

  const refresh = useCallback(async () => {
    const version = ++catalogGeneration.current;
    setLoading(true); setError('');
    try {
      const data = await getCatalog();
      if (version === catalogGeneration.current) setState(s => ({ ...s, ...data }));
    } catch (e) { if (version === catalogGeneration.current) setError(errorMessage(e)); throw e; }
    finally { if (version === catalogGeneration.current) setLoading(false); }
  }, []);
  const refreshPrivate = useCallback(async () => {
    const user = currentUser.current;
    const version = ++privateGeneration.current;
    setPrivateError('');
    if (!user) { setState(s => ({ ...s, orders: [], coupons: [] })); setUsers([]); setStats(null); setPrivateLoading(false); return; }
    setPrivateLoading(true);
    const results = await Promise.allSettled([getOrders(user), ...(user.isAdmin ? [getCoupons(), getUsers(), getStats()] : [])]);
    if (version !== privateGeneration.current || currentUser.current?.id !== user.id) return;
    const orders = results[0];
    if (orders.status === 'fulfilled') setState(s => ({ ...s, orders: orders.value as State['orders'] }));
    if (user.isAdmin) {
      const couponResult = results[1];
      const userResult = results[2];
      if (couponResult.status === 'fulfilled') setState(s => ({ ...s, coupons: couponResult.value as Coupon[] }));
      if (userResult.status === 'fulfilled') setUsers(userResult.value as User[]);
      const statsResult = results[3];
      if (statsResult.status === 'fulfilled') setStats(statsResult.value as DashboardStats);
    }
    const failure = results.find(r => r.status === 'rejected');
    if (failure?.status === 'rejected') setPrivateError(errorMessage(failure.reason));
    setPrivateLoading(false);
  }, []);
  useEffect(() => {
    let cancelled = false;
    const invalidateRequests = () => { catalogGeneration.current++; privateGeneration.current++; };
    Promise.resolve().then(() => { if (!cancelled) { setState(s => ({ ...s, ...loadPreferences() })); setReady(true); void refresh().catch(() => {}); } });
    return () => { cancelled = true; invalidateRequests(); };
  }, [refresh]);
  useEffect(() => { if (ready) savePreferences({ cart: state.cart, favorites: state.favorites }); }, [ready, state.cart, state.favorites]);
  const previousUser = useRef<string | null>(null);
  useEffect(() => {
    const userId = auth.user?.id || null;
    const changedAccount = previousUser.current !== null && previousUser.current !== userId;
    previousUser.current = userId;
    Promise.resolve().then(() => {
      setState(s => ({ ...s, orders: [], coupons: [], discountCode: '', ...(changedAccount ? { cart: {} } : {}) }));
      setAppliedCoupon(null); setUsers([]); setStats(null);
      void refreshPrivate();
    });
  }, [auth.user?.id, auth.user?.isAdmin, refreshPrivate]);

  async function mutate<T>(action: () => Promise<T>): Promise<T> {
    if (mutationLock.current) throw new Error('Một yêu cầu đang được xử lý. Vui lòng chờ.');
    mutationLock.current = true; setMutating(true);
    try { return await action(); }
    finally { mutationLock.current = false; setMutating(false); }
  }
  const assertAdmin = () => { if (!auth.user?.isAdmin) throw new Error('Chỉ quản trị viên được phép thực hiện thao tác này.'); };
  const shop: Shop = {
    ...state, ready, loading, error, mutating, privateLoading, privateError, users, stats, appliedCoupon, refresh, refreshPrivate,
    add(id) { const p = state.products.find(p => p.id === id); if (!p || (state.cart[id] || 0) >= p.stock) return false; setState(s => ({ ...s, cart: { ...s.cart, [id]: Math.min((s.cart[id] || 0) + 1, p.stock) } })); return true; },
    quantity(id, quantity) { setState(s => { const cart = { ...s.cart }; const stock = s.products.find(p => p.id === id)?.stock || 0; if (quantity <= 0 || stock <= 0) delete cart[id]; else cart[id] = Math.min(Math.floor(quantity), stock); return { ...s, cart }; }); },
    favorite(id) { setState(s => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter(n => n !== id) : [...s.favorites, id] })); },
    clearCoupon() { setAppliedCoupon(null); setState(s => ({ ...s, discountCode: '' })); },
    applyCoupon(code) { return mutate(async () => {
      const lines = state.products.filter(p => state.cart[p.id] > 0);
      if (!lines.length) throw new Error('Thêm sản phẩm vào giỏ trước khi áp mã.');
      try { const coupon = await validateCoupon(code, lines); setAppliedCoupon(coupon); setState(s => ({ ...s, discountCode: coupon.code })); }
      catch (e) { setAppliedCoupon(null); setState(s => ({ ...s, discountCode: '' })); throw e; }
    }); },
    updateProduct(product) { return mutate(async () => { assertAdmin(); const saved = await saveProduct(product, state.categories); setState(s => ({ ...s, products: s.products.some(p => p.id === saved.id) ? s.products.map(p => p.id === saved.id ? saved : p) : [saved, ...s.products] })); }); },
    deleteProduct(id) { return mutate(async () => { assertAdmin(); await removeProduct(id); setState(s => { const cart = { ...s.cart }; delete cart[id]; return { ...s, products: s.products.filter(p => p.id !== id), cart, favorites: s.favorites.filter(n => n !== id) }; }); }); },
    updateCoupon(coupon) { return mutate(async () => { assertAdmin(); const ownerId = auth.user?.id; const saved = await createCoupon(coupon); if (currentUser.current?.id === ownerId && currentUser.current?.isAdmin) setState(s => ({ ...s, coupons: [saved, ...s.coupons] })); }); },
    deleteCoupon(id) { return mutate(async () => { assertAdmin(); await removeCoupon(id); const removed = state.coupons.find(c => c.id === id); if (removed?.code === state.discountCode) { setAppliedCoupon(null); setState(s => ({ ...s, discountCode: '' })); } setState(s => ({ ...s, coupons: s.coupons.filter(c => c.id !== id) })); }); },
    updateOrder(id, action) { return mutate(async () => {
      if (!auth.user) throw new Error('Vui lòng đăng nhập.');
      if (action !== 'cancel') assertAdmin();
      const order = await changeOrder(id, action, auth.user);
      if (currentUser.current?.id === auth.user.id) setState(s => ({ ...s, orders: s.orders.map(o => o.id === id ? order : o) }));
      if (action === 'cancel') void refresh().catch(() => {});
      void refreshPrivate();
    }); },
    placeOrder(details, code) { return mutate(async () => {
      const user = auth.user;
      if (!user) throw new Error('Vui lòng đăng nhập trước khi đặt hàng.');
      if (!details.address.trim() || !details.city.trim() || !details.postalCode.trim() || !details.country.trim()) throw new Error('Vui lòng nhập đầy đủ địa chỉ giao hàng.');
      const selected = state.products.filter(p => state.cart[p.id] > 0);
      if (!selected.length) throw new Error('Giỏ hàng trống.');
      // Read current prices and stock before submitting; the API owns the final total.
      const products = await Promise.all(selected.map(p => getProduct(p.id, state.categories)));
      const lines = products.map(product => ({ product, quantity: state.cart[product.id] }));
      if (products.some(p => p.price !== selected.find(old => old.id === p.id)?.price)) { void refresh().catch(() => {}); throw new Error('Giá sản phẩm đã thay đổi. Vui lòng xem lại giỏ hàng trước khi đặt.'); }
      if (lines.some(l => !Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > l.product.stock)) { void refresh().catch(() => {}); throw new Error('Tồn kho đã thay đổi. Vui lòng kiểm tra lại giỏ hàng.'); }
      const coupon = code ? await validateCoupon(code, products) : null;
      const totals = cartTotals(products, state.cart, coupon);
      const order = await createOrder(details, lines, totals.shipping, code, user);
      if (currentUser.current?.id === user.id) {
        setState(s => {
          const cart = { ...s.cart };
          for (const line of lines) { const remaining = (cart[line.product.id] || 0) - line.quantity; if (remaining > 0) cart[line.product.id] = remaining; else delete cart[line.product.id]; }
          return { ...s, cart, discountCode: '', orders: [order, ...s.orders] };
        });
        setAppliedCoupon(null);
      }
      void refresh().catch(() => {});
      return order;
    }); },
  };
  return <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>;
}
