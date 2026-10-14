import type { State } from '@/types/shop';

// API-owned data always starts empty. Demo fixtures are never loaded at runtime.
export const initialState: State = { products: [], categories: [], cart: {}, favorites: [], orders: [], coupons: [], discountCode: '' };
