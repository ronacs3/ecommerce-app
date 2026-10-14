import { Platform } from 'react-native';
import { API_URL } from '@/config/api';

type Preferences = { cart: Record<string, number>; favorites: string[] };
const KEY = `techshop-api-cart-v1:${API_URL}`;
export function loadPreferences(): Preferences {
  const empty: Preferences = { cart: {}, favorites: [] };
  if (Platform.OS !== 'web') return empty;
  try {
    const text = localStorage.getItem(KEY);
    if (!text) return empty;
    const saved = JSON.parse(text);
    const cart: Record<string, number> = {};
    if (saved.cart && typeof saved.cart === 'object') for (const [id, quantity] of Object.entries(saved.cart)) if (typeof quantity === 'number' && Number.isInteger(quantity) && quantity > 0 && /^[a-f\d]{24}$/i.test(id)) cart[id] = quantity;
    return { cart, favorites: Array.isArray(saved.favorites) ? saved.favorites.filter((id: unknown) => typeof id === 'string') : [] };
  } catch { return empty; }
}
export function savePreferences(value: Preferences) {
  if (Platform.OS !== 'web') return;
  try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* Preferences remain available in this session. */ }
}
