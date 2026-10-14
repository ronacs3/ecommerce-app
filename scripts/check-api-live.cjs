const assert = require('node:assert/strict');
const base = (process.env.EXPO_PUBLIC_API_URL || 'https://backend-e-commerce-navy.vercel.app/api').replace(/\/+$/, '');

async function get(path) {
  const response = await fetch(base + path, { headers: { Origin: 'http://localhost:3000' }, signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, path + ' status');
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:3000', path + ' CORS');
  return response.json();
}
async function main() {
  const [products, categories] = await Promise.all([get('/products'), get('/categories')]);
  assert.ok(Array.isArray(products));
  assert.ok(Array.isArray(categories));
  for (const product of products) { assert.ok(typeof product._id === 'string'); assert.ok(Number.isFinite(product.price)); assert.ok(Number.isFinite(product.countInStock)); }
  if (products.length) {
    const detail = await get('/products/' + encodeURIComponent(products[0]._id));
    assert.equal(detail._id, products[0]._id);
  }
  const preflight = await fetch(base + '/users/login', { method: 'OPTIONS', headers: { Origin: 'http://localhost:3000', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type,authorization' }, signal: AbortSignal.timeout(15000) });
  assert.ok(preflight.ok);
  assert.equal(preflight.headers.get('access-control-allow-origin'), 'http://localhost:3000');
  const privateResponse = await fetch(base + '/orders/myorders', { signal: AbortSignal.timeout(15000) });
  assert.equal(privateResponse.status, 401);
  console.log(`Live read-only checks passed: ${products.length} products, ${categories.length} categories, product detail, CORS/preflight, and anonymous 401. No accounts, orders or emails were created.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
