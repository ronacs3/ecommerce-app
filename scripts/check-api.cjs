const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const cache = new Map();
const calls = [];
let responder = () => ({ status: 200, body: [] });
const mockFetch = async (url, options) => {
  const call = { url, ...options, json: options.body ? JSON.parse(options.body) : null };
  calls.push(call);
  const result = responder(call);
  return new Response(JSON.stringify(result.body), { status: result.status });
};
function load(file) {
  const absolute = path.resolve(file);
  if (cache.has(absolute)) return cache.get(absolute);
  const exports = {};
  cache.set(absolute, exports);
  const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, {
    exports, AbortController, setTimeout, clearTimeout, fetch: mockFetch,
    process: { env: { EXPO_PUBLIC_API_URL: 'http://localhost:5000/api' } },
    require: name => {
      if (name === 'react-native') return { Platform: { OS: 'web' } };
      const target = name.startsWith('@/') ? path.resolve('src', name.slice(2)) : path.resolve(path.dirname(absolute), name);
      return load(target + '.ts');
    },
  }, { filename: absolute });
  return exports;
}
async function main() {
  const http = load('src/services/api/http.ts');
  const adapters = load('src/services/api/adapters.ts');
  const catalogApi = load('src/services/api/catalog.ts');
  const couponsApi = load('src/services/api/coupons.ts');
  const ordersApi = load('src/services/api/orders.ts');
  const { cartTotals } = load('src/utils/commerce.ts');
  const categories = [{ _id: 'cat-phone', name: 'Smartphone' }, { _id: 'cat-laptop', name: 'Laptop' }].map(adapters.mapCategory);
  const rawProduct = { _id: 'product-one', name: 'Test phone', category: 'cat-phone', price: 100000, image: '/images/phone.jpg', countInStock: 5, description: 'A real description' };
  const product = adapters.mapProduct(rawProduct, categories);
  assert.equal(product.id, 'product-one');
  assert.equal(product.category, 'Điện thoại');
  assert.equal(product.categoryKey, 'cat-phone');
  assert.equal(product.image, 'http://localhost:5000/images/phone.jpg');
  assert.equal(product.stock, 5);
  assert.equal(adapters.mapProduct({ ...rawProduct, category: { _id: 'cat-phone', name: 'Smartphone' } }, categories).categoryId, 'cat-phone');
  assert.equal(adapters.mapProduct({ ...rawProduct, category: 'Laptop' }, categories).categoryId, 'cat-laptop');
  const other = { ...product, id: 'other', price: 900000, categoryKey: 'cat-laptop' };
  const coupon = { code: 'PHONE10', active: true, percent: 10, applicableCategories: ['cat-phone'] };
  const totals = cartTotals([product, other], { 'product-one': 1, other: 1 }, coupon);
  assert.equal(totals.subtotal, 1000000);
  assert.equal(totals.discount, 10000);
  assert.equal(totals.total, 990000);
  assert.equal(cartTotals([other], { other: 1 }, coupon).discount, 0);
  assert.equal(cartTotals([product], { 'product-one': 2 }, { ...coupon, applicableCategories: [] }).discount, 20000);

  // A protected call must fail without issuing an anonymous request.
  const before = calls.length;
  await assert.rejects(() => http.request('/orders', { auth: true }), e => e.status === 401);
  assert.equal(calls.length, before);
  http.setAccessToken('test-token-not-a-real-jwt');
  responder = () => ({ status: 200, body: [rawProduct] });
  await http.request('/products');
  assert.equal(calls.at(-1).headers.Authorization, undefined);
  const user = { id: 'user-one', name: 'Test Customer', email: 'test@example.invalid', isAdmin: false };
  const rawOrder = { _id: 'order-one', user: 'user-one', shippingAddress: { address: 'Example Street', city: 'Hanoi', postalCode: '100000', country: 'VN' }, paymentMethod: 'COD', totalPrice: 230000, createdAt: '2026-10-14T00:00:00.000Z', isPaid: false, isDelivered: false, orderItems: [{ product: 'product-one', name: product.name, qty: 2 }] };
  responder = () => ({ status: 201, body: rawOrder });
  const order = await ordersApi.createOrder({ ...rawOrder.shippingAddress, payment: 'COD' }, [{ product, quantity: 2 }], 30000, 'PHONE10', user);
  const create = calls.at(-1);
  assert.equal(create.url, 'http://localhost:5000/api/orders');
  assert.equal(create.method, 'POST');
  assert.equal(create.headers.Authorization, 'Bearer test-token-not-a-real-jwt');
  assert.equal(create.json.orderItems[0].product, 'product-one');
  assert.equal(create.json.orderItems[0].qty, 2);
  assert.equal(create.json.shippingAddress.postalCode, '100000');
  assert.equal(create.json.couponCode, 'PHONE10');
  assert.equal(create.json.totalPrice, undefined); // The server computes the final total.
  assert.equal(order.total, 230000);
  assert.equal(order.userId, user.id);
  assert.equal(order.status, 'Đang xử lý');
  assert.equal(adapters.mapOrder({ ...rawOrder, isCancelled: true }).status, 'Đã hủy');
  responder = () => ({ status: 200, body: { code: 'PHONE10', discount: 10, applicableCategories: ['cat-phone'] } });
  const validated = await couponsApi.validateCoupon(' phone10 ', [product]);
  assert.equal(calls.at(-1).json.cartItems[0].category, 'cat-phone');
  assert.equal(calls.at(-1).json.code, 'PHONE10');
  assert.equal(validated.percent, 10);
  responder = () => ({ status: 200, body: rawProduct });
  await catalogApi.saveProduct({ ...product, description: 'Updated description' }, categories);
  assert.equal(calls.at(-1).method, 'PUT');
  assert.equal(calls.at(-1).json.countInStock, 5);
  assert.equal(calls.at(-1).json.category, 'cat-phone');
  assert.equal(calls.at(-1).json.description, 'Updated description');
  responder = () => ({ status: 200, body: { order: { ...rawOrder, isCancelled: true } } });
  assert.equal((await ordersApi.changeOrder('order-one', 'cancel', user)).isCancelled, true);
  responder = () => ({ status: 200, body: [] });
  await ordersApi.getOrders(user);
  assert.ok(calls.at(-1).url.endsWith('/orders/myorders'));
  await ordersApi.getOrders({ ...user, isAdmin: true });
  assert.ok(calls.at(-1).url.endsWith('/orders'));
  let expired = false;
  http.setUnauthorizedHandler(() => { expired = true; http.setAccessToken(null); });
  responder = () => ({ status: 401, body: { message: 'Token expired', stack: 'server secret stack' } });
  await assert.rejects(() => http.request('/users/profile', { auth: true }), e => e.status === 401 && e.message === 'Token expired');
  assert.equal(expired, true);
  const after = calls.length;
  await assert.rejects(() => http.request('/orders', { auth: true }));
  assert.equal(calls.length, after);
  console.log('API contract checks passed: string IDs, category mapping, image URLs, scoped coupons, JWT, request payloads, customer/admin orders and 401 invalidation. No backend writes were performed.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
