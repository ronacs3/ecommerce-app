export type ApiUser = { _id: string; name: string; email: string; isAdmin: boolean; token?: string };
export type ApiCategory = { _id: string; name: string; description?: string; image?: string };
export type ApiProduct = { _id: string; name: string; category: string | { _id: string; name: string }; description: string; price: number; image: string; countInStock: number; rating?: number; numReviews?: number };
export type ApiCoupon = { _id?: string; code: string; discount: number; expirationDate?: string; applicableCategories?: string[]; isActive?: boolean };
export type ApiOrder = { _id: string; user: string | ApiUser; shippingAddress: { address: string; city: string; postalCode: string; country: string }; paymentMethod: string; totalPrice: number; createdAt: string; isPaid: boolean; isDelivered: boolean; isCancelled?: boolean; orderItems: { product: string; name: string; qty: number }[] };
