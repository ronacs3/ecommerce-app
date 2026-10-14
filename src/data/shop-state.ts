import type { State } from '@/types/shop';
import { initialProducts } from './products';

export const initialState: State = { products: initialProducts, cart: {}, favorites: [], orders: [], discountCode: '', coupons: [{ code: 'WELCOME10', percent: 10, active: true }, { code: 'HOME20', percent: 20, active: true }] };
