import { useEffect, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Icon } from '@/components/common/Icon';
import { ProductImage } from '@/components/products/ProductImage';
import { green } from '@/constants/catalog';
import { useShop } from '@/hooks/useShop';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import type { Coupon } from '@/types/shop';
import { money } from '@/utils/money';

const defaultCoupons: Coupon[] = [
  { code: 'TECHSHOP10', percent: 10, active: true, expirationDate: '2026-12-31T23:59:59Z', applicableCategories: [] },
  { code: 'PHONE10', percent: 10, active: true, expirationDate: '2026-12-31T23:59:59Z', applicableCategories: ['cat-phone', 'Điện thoại'] },
  { code: 'LAPTOP15', percent: 15, active: true, expirationDate: '2026-12-31T23:59:59Z', applicableCategories: ['cat-laptop', 'Laptop'] },
  { code: 'GEAR20', percent: 20, active: true, expirationDate: '2026-12-31T23:59:59Z', applicableCategories: ['cat-gear', 'Phụ kiện', 'Tai nghe'] },
  { code: 'FREESHIP', percent: 5, active: true, expirationDate: '2026-12-31T23:59:59Z', applicableCategories: [] },
];

export default function PromotionsPage() {
  const shop = useShop();
  const { notify, go, add } = useStoreUI();
  const { width } = useWindowDimensions();
  const desktop = width >= 860;

  const [activeTab, setActiveTab] = useState('Tất cả');
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 34, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Merge coupons from API with default store coupons
  const allCoupons: Coupon[] = [
    ...shop.coupons,
    ...defaultCoupons.filter(d => !shop.coupons.some(c => c.code.toUpperCase() === d.code.toUpperCase()))
  ];

  const filteredCoupons = allCoupons.filter(c => {
    if (activeTab === 'Tất cả') return true;
    if (activeTab === 'Toàn sàn') return !c.applicableCategories || c.applicableCategories.length === 0;
    if (activeTab === 'Điện thoại') return c.applicableCategories?.some(cat => cat.toLowerCase().includes('phone') || cat.toLowerCase().includes('thoại'));
    if (activeTab === 'Laptop') return c.applicableCategories?.some(cat => cat.toLowerCase().includes('laptop'));
    if (activeTab === 'Phụ kiện') return c.applicableCategories?.some(cat => cat.toLowerCase().includes('gear') || cat.toLowerCase().includes('phụ kiện') || cat.toLowerCase().includes('tai nghe'));
    return true;
  });

  const handleCopy = (code: string) => {
    void shop.applyCoupon(code).catch(() => {});
    notify(`Đã sao chép mã ${code}! Đã tự động kích hoạt cho giỏ hàng.`);
  };

  // Flash sale products (has oldPrice or discount)
  const flashSaleProducts = shop.products.filter(p => p.oldPrice || p.tag).slice(0, 4);

  return (
    <View style={{ gap: 32 }}>
      {/* Banner Săn Sale */}
      <View style={[s.hero, { minHeight: 280, backgroundColor: '#0f172a' }]}>
        <View style={s.heroGlow} />
        <View style={[s.heroInner, { padding: desktop ? 36 : 24, flexDirection: desktop ? 'row' : 'column', gap: 24, alignItems: desktop ? 'center' : 'flex-start' }]}>
          <View style={{ flex: 1.5, gap: 12 }}>
            <View style={s.heroBadge}>
              <Icon name="percent" size={14} color="#2dd4bf" />
              <Text style={{ color: '#2dd4bf', fontSize: 11, fontWeight: '700' }}>SIÊU HỘI KHUYẾN MÃI TECHSHOP</Text>
            </View>
            <Text style={[s.heroTitle, { fontSize: desktop ? 36 : 26, lineHeight: desktop ? 44 : 34 }]}>
              Săn Voucher Công Nghệ Đến 20%
            </Text>
            <Text style={[s.heroDescription, { fontSize: 13, lineHeight: 22 }]}>
              Thu thập mã giảm giá độc quyền cho Laptop, Smartphone và Phụ kiện cao cấp. Áp dụng ngay tại bước thanh toán.
            </Text>
          </View>

          {/* Countdown Clock */}
          <View style={{ backgroundColor: '#ffffff10', borderWidth: 1, borderColor: '#ffffff20', padding: 20, borderRadius: 14, alignItems: 'center', gap: 10 }}>
            <Text style={{ color: '#2dd4bf', fontSize: 12, fontWeight: '700' }}>⚡ FLASH SALE KẾT THÚC TRONG</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ backgroundColor: '#2dd4bf', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}>
                <Text style={{ color: '#0f172a', fontSize: 20, fontWeight: '900' }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>:</Text>
              <View style={{ backgroundColor: '#2dd4bf', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}>
                <Text style={{ color: '#0f172a', fontSize: 20, fontWeight: '900' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>:</Text>
              <View style={{ backgroundColor: '#2dd4bf', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}>
                <Text style={{ color: '#0f172a', fontSize: 20, fontWeight: '900' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </Text>
              </View>
            </View>
            <Text style={{ color: '#94a3b8', fontSize: 11 }}>Số lượng voucher có hạn mỗi ngày</Text>
          </View>
        </View>
      </View>

      {/* Tabs Filter */}
      <View style={{ gap: 18 }}>
        <View style={s.sectionHeading}>
          <View>
            <Text style={s.eyebrow}>MÃ GIẢM GIÁ KHẢ DỤNG</Text>
            <Text style={s.sectionTitle}>Kho Voucher TechShop</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {['Tất cả', 'Toàn sàn', 'Laptop', 'Điện thoại', 'Phụ kiện'].map(tab => {
              const active = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[s.filter, active && s.filterActive, { paddingVertical: 6, paddingHorizontal: 12 }]}
                >
                  <Text style={{ fontSize: 12, color: active ? '#fff' : '#334155', fontWeight: active ? '700' : '500' }}>
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Voucher Cards Grid */}
        <View style={{ flexDirection: desktop ? 'row' : 'column', flexWrap: 'wrap', gap: 16 }}>
          {filteredCoupons.map((coupon, idx) => {
            const isApplied = shop.discountCode.toUpperCase() === coupon.code.toUpperCase();
            return (
              <View
                key={coupon.code + idx}
                style={[
                  s.panel,
                  {
                    width: desktop ? '48.5%' : '100%',
                    padding: 0,
                    overflow: 'hidden',
                    borderColor: isApplied ? green : '#e2e8f0',
                    borderWidth: isApplied ? 2 : 1,
                  }
                ]}
              >
                <View style={{ flexDirection: 'row', minHeight: 120 }}>
                  {/* Left coupon value badge */}
                  <View style={{ width: 110, backgroundColor: isApplied ? green : '#0f172a', alignItems: 'center', justifyContent: 'center', padding: 12, gap: 4 }}>
                    <Text style={{ color: '#2dd4bf', fontSize: 11, fontWeight: '800' }}>GIẢM</Text>
                    <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900' }}>{coupon.percent}%</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 10, textAlign: 'center' }}>TOÀN BỘ ĐƠN</Text>
                  </View>

                  {/* Right coupon content */}
                  <View style={{ flex: 1, padding: 16, justifyContent: 'space-between', gap: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 16, fontWeight: '900', color: '#0f172a', letterSpacing: 0.5 }}>{coupon.code}</Text>
                        {isApplied && (
                          <View style={[s.statusPill, { paddingVertical: 2, paddingHorizontal: 6 }]}>
                            <Text style={{ fontSize: 10, color: green, fontWeight: '700' }}>Đang áp dụng</Text>
                          </View>
                        )}
                      </View>
                      <Pressable
                        onPress={() => handleCopy(coupon.code)}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#f1f5f9' }}
                      >
                        <Icon name="copy" size={13} color={green} />
                        <Text style={{ fontSize: 11, color: green, fontWeight: '700' }}>Lấy mã</Text>
                      </Pressable>
                    </View>

                    <Text style={{ fontSize: 12, color: '#475569' }}>
                      {coupon.applicableCategories?.length
                        ? `Áp dụng cho: ${coupon.applicableCategories.join(', ')}`
                        : 'Áp dụng cho mọi sản phẩm công nghệ'}
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 8 }}>
                      <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                        Hạn dùng: {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString('vi-VN') : '31/12/2026'}
                      </Text>
                      <Pressable onPress={() => go('/shop')}>
                        <Text style={s.underlink}>Dùng ngay →</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Flash Sale Featured Items */}
      {flashSaleProducts.length > 0 && (
        <View style={{ gap: 18 }}>
          <View style={s.sectionHeading}>
            <View>
              <Text style={s.eyebrow}>ƯU ĐÃI ĐANG DIỄN RA</Text>
              <Text style={s.sectionTitle}>Sản phẩm giảm giá sốc</Text>
            </View>
            <Pressable onPress={() => go('/shop')}>
              <Text style={s.viewLink}>Xem tất cả sản phẩm sale →</Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: desktop ? 'row' : 'column', flexWrap: 'wrap', gap: 18 }}>
            {flashSaleProducts.map(p => (
              <View key={p.id} style={[s.panel, { width: desktop ? '48.5%' : '100%', padding: 16, flexDirection: 'row', gap: 16, alignItems: 'center' }]}>
                <View style={{ width: 100, height: 100, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}>
                  <ProductImage uri={p.image} style={{ width: '100%', height: '100%' }} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontSize: 11, color: green, fontWeight: '700' }}>{p.category.toUpperCase()}</Text>
                  <Pressable onPress={() => go(`/product?id=${p.id}`)}>
                    <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>{p.name}</Text>
                  </Pressable>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: green }}>{money(p.price)}</Text>
                    {p.oldPrice && <Text style={[s.oldPrice, { fontSize: 12 }]}>{money(p.oldPrice)}</Text>}
                  </View>
                </View>
                <Pressable
                  disabled={!p.stock}
                  onPress={() => add(p)}
                  style={[s.addSmall, { paddingHorizontal: 12, paddingVertical: 8 }]}
                >
                  <Icon name="bag" size={14} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Mua ngay</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Promotion Rules */}
      <View style={[s.panel, { padding: 24, gap: 12, backgroundColor: '#f8fafc' }]}>
        <Text style={[s.sectionTitle, { fontSize: 16 }]}>Điều kiện sử dụng mã khuyến mãi</Text>
        <Text style={{ fontSize: 12, color: '#64748b', lineHeight: 20 }}>
          1. Mỗi đơn hàng chỉ áp dụng 01 mã voucher tại một thời điểm.{String.fromCharCode(10)}
          2. Mã giảm giá có thể kết hợp cùng chính sách miễn phí vận chuyển cho đơn hàng từ 500.000đ.{String.fromCharCode(10)}
          3. Không áp dụng đồng thời với các chương trình thanh lý xả kho đặc biệt.{String.fromCharCode(10)}
          4. Nếu có thắc mắc trong quá trình áp dụng voucher, vui lòng liên hệ hotline 1900 6789 để được hỗ trợ tức thì.
        </Text>
      </View>
    </View>
  );
}
