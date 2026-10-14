export type Product = { id: number; name: string; category: string; price: number; oldPrice?: number; image: string; tag?: string; colors: string[]; stock: number };

export type Order = { id: string; name: string; email: string; address: string; payment: string; total: number; status: string; date: string; items: { name: string; quantity: number }[] };

export type Coupon = { code: string; percent: number; active: boolean };

export type State = { products: Product[]; cart: Record<string, number>; favorites: number[]; orders: Order[]; coupons: Coupon[]; discountCode: string };

export type Shop = State & { ready: boolean; add: (id: number) => boolean; quantity: (id: number, value: number) => void; favorite: (id: number) => void; applyCoupon: (code: string) => boolean; updateProduct: (product: Product) => void; deleteProduct: (id: number) => void; updateCoupon: (coupon: Coupon) => void; updateOrder: (id: string, status: string) => void; placeOrder: (details: { name: string; email: string; address: string; payment: string }, coupon: string) => Order | null };
