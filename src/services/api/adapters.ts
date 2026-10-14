import { assetUrl } from '@/config/api';
import type { ApiCategory, ApiCoupon, ApiOrder, ApiProduct, ApiUser } from '@/types/api';
import type { Category, Coupon, Order, Product, User } from '@/types/shop';

const labels: Record<string, string> = { Smartphone: 'Điện thoại', Smartwatch: 'Đồng hồ', Headphone: 'Tai nghe', Earphone: 'Tai nghe nhét tai', Accessory: 'Phụ kiện', Monitor: 'Màn hình', Keyboard: 'Bàn phím', Mouse: 'Chuột', Tablet: 'Máy tính bảng', Console: 'Máy chơi game' };
export const categoryLabel = (name: string) => labels[name] || name;
export const mapUser = (value: ApiUser): User => ({ id: value._id, name: value.name, email: value.email, isAdmin: value.isAdmin === true });
export const mapCategory = (value: ApiCategory): Category => ({ id: value._id, name: value.name, label: categoryLabel(value.name), image: assetUrl(value.image || ''), description: value.description || '' });
export function mapProduct(value: ApiProduct, categories: Category[]): Product {
  const raw = typeof value.category === 'string' ? value.category : value.category._id;
  const category = categories.find(c => c.id === raw || c.name === raw);
  const name = category?.name || (typeof value.category === 'object' ? value.category.name : raw);
  return { id: value._id, name: value.name, category: categoryLabel(name), categoryKey: raw, categoryId: category?.id, description: value.description || '', specs: value.description ? [value.description] : [], price: Number(value.price), image: assetUrl(value.image), stock: Number(value.countInStock), colors: [], rating: value.rating, numReviews: value.numReviews };
}
export const mapCoupon = (value: ApiCoupon): Coupon => ({ id: value._id, code: value.code, percent: value.discount, active: value.isActive !== false, expirationDate: value.expirationDate, applicableCategories: value.applicableCategories || [] });
export function mapOrder(value: ApiOrder, fallback?: User | null): Order {
  const user = typeof value.user === 'object' ? value.user : null;
  const address = value.shippingAddress;
  return { id: value._id, userId: user?._id || String(value.user), name: user?.name || fallback?.name || 'Khách hàng', email: user?.email || fallback?.email || '', address: [address.address, address.city, address.postalCode, address.country].filter(Boolean).join(', '), payment: value.paymentMethod, total: Number(value.totalPrice), status: value.isCancelled ? 'Đã hủy' : value.isDelivered ? 'Đã giao' : value.isPaid ? 'Đã thanh toán' : 'Đang xử lý', date: value.createdAt, isPaid: value.isPaid, isDelivered: value.isDelivered, isCancelled: !!value.isCancelled, items: value.orderItems.map(i => ({ name: i.name, quantity: i.qty, productId: i.product })) };
}
