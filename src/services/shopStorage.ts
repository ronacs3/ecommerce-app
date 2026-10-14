import type { State } from '@/types/shop';
import { Platform } from 'react-native';

const STORAGE_KEY = 'form-field-shop-v1';

export function loadShopState(fallback: State): State {
  if (Platform.OS !== 'web') return fallback;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;
    const value = JSON.parse(saved);
    if (Array.isArray(value.products) && Array.isArray(value.orders) && Array.isArray(value.coupons) && Array.isArray(value.favorites) && value.cart) return { ...fallback, ...value };
  } catch { /* Storage can be unavailable in private browsing. */ }
  return fallback;
}

export function saveShopState(state: State): void {
  if (Platform.OS !== 'web') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { /* Continue with session state. */ }
}
