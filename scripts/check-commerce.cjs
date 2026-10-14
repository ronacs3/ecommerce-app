const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');

function load(file, imports = {}) {
  const source = fs.readFileSync(file, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {}, require: name => {
    if (!(name in imports)) throw new Error('Unexpected import: ' + name);
    return imports[name];
  } };
  vm.runInNewContext(code, context);
  return context.exports;
}

const constants = load('src/constants/catalog.ts');
const { checkoutTotals } = load('src/utils/commerce.ts', { '@/constants/catalog': constants });
assert.equal(checkoutTotals(24990000, 15).total, 21241500);
assert.equal(checkoutTotals(199000, 15).total, 199150);
assert.equal(checkoutTotals(499999).shipping, 30000);
assert.equal(checkoutTotals(500000).shipping, 0);
assert.equal(checkoutTotals(500000, 15).shipping, 0);
assert.equal(checkoutTotals(199999, 15).discount, 30000);
assert.equal(checkoutTotals(199999, 15).total, 199999);
assert.equal(checkoutTotals(0, 0, false).total, 0);
assert.equal(checkoutTotals(100000, -10).discount, 0);
assert.equal(checkoutTotals(100000, 100).discount, 100000);

const { filterCatalog } = load('src/utils/catalog.ts');
const { initialProducts } = load('src/data/products.ts');
const defaults = { search: '', sort: 'Featured', wishlist: false };
const filter = options => filterCatalog(initialProducts, ['2'], { ...defaults, ...options });
assert.equal(filter({ search: 'DIEN THOAI' })[0].name, 'iPhone 16 128GB Chính hãng');
assert.equal(filter({ category: 'Laptop' }).length, 2);
assert.equal(filter({ min: '1000000', max: '2500000' }).length, 2);
assert.equal(filter({ wishlist: true })[0].id, '2');
assert.equal(filter({ sort: 'Price: low to high' })[0].id, '9');
assert.equal(filter({ sort: 'Price: high to low' })[0].id, '1');
assert.equal(initialProducts[0].id, '1');
assert.equal(filter({ search: 'khong co san pham nay' }).length, 0);
assert.equal(filter({ filter: 'new' }).length, 2);
console.log('19 checks passed: VND totals, coupon rounding, shipping, Vietnamese search, category/price filtering, wishlist and sorting.');
