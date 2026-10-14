import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { Icon } from '@/components/common/Icon';
import { ProductImage } from '@/components/products/ProductImage';
import { green } from '@/constants/catalog';
import { useAuth } from '@/hooks/useAuth';
import { useShop } from '@/hooks/useShop';
import { errorMessage } from '@/services/api/http';
import { s } from '@/styles/store';
import type { Order } from '@/types/shop';
import { cartTotals } from '@/utils/commerce';
import { money } from '@/utils/money';

export function CartCheckout({ checkout, compact, notify, go }: { checkout: boolean; compact: boolean; notify: (m: string) => void; go: (r: string) => void }) {
  const shop = useShop();
  const auth = useAuth();
  const [coupon, setCoupon] = useState(shop.discountCode);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Việt Nam');
  const [placed, setPlaced] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const lines = shop.products.filter(p => shop.cart[p.id] > 0);
  const totals = cartTotals(shop.products, shop.cart, shop.appliedCoupon);
  const unavailable = lines.some(p => shop.cart[p.id] > p.stock || p.stock <= 0);
  async function apply() {
    setError('');
    try { await shop.applyCoupon(coupon); setCoupon(coupon.trim().toUpperCase()); notify('Đã xác nhận mã giảm giá từ cửa hàng.'); } catch (e) { setError(errorMessage(e)); }
  }
  async function submit() {
    if (!checkout) { go('/checkout'); return; }
    if (!auth.user) { go('/login?redirect=/checkout'); return; }
    if (address.trim().length < 5 || !city.trim() || !postalCode.trim() || !country.trim()) { setError('Vui lòng nhập địa chỉ, tỉnh/thành phố, mã bưu chính và quốc gia.'); return; }
    setError('');
    try { setPlaced(await shop.placeOrder({ address, city, postalCode, country, payment: 'COD' }, shop.discountCode)); }
    catch (e) { setError(errorMessage(e)); }
  }
  if (placed) return <View style={s.empty}><View style={s.successIcon}><Icon name="check" size={35} color={green} /></View><Text style={s.pageTitle}>Đặt hàng thành công!</Text><Text style={s.sectionSubtitle}>Đơn hàng #{placed.id} đã được lưu trên hệ thống.</Text><Text style={s.price}>Tổng thanh toán: {money(placed.total)}</Text><Text style={s.sectionSubtitle}>Thanh toán khi nhận hàng (COD).</Text><Button onPress={() => go('/account')}>Xem đơn hàng →</Button><Button secondary onPress={() => go('/')}>Tiếp tục mua sắm</Button></View>;
  if (shop.loading && !shop.products.length) return <View style={s.empty}><Text style={s.sectionSubtitle}>Đang tải giỏ hàng…</Text></View>;
  return <>
    <View style={s.pageHeading}><Text style={s.eyebrow}>{checkout ? 'HOÀN TẤT ĐƠN HÀNG' : 'GIỎ HÀNG TECHSHOP'}</Text><Text style={s.pageTitle}>{checkout ? 'Thông tin thanh toán' : 'Giỏ hàng của bạn'}</Text><Text style={s.sectionSubtitle}>{checkout ? 'Kiểm tra thông tin trước khi gửi đơn hàng tới cửa hàng.' : 'Kiểm tra sản phẩm và áp mã ưu đãi trước khi thanh toán.'}</Text></View>
    {!lines.length ? <View style={s.empty}><Icon name="bag" size={42} color={green} /><Text style={s.sectionTitle}>Giỏ hàng của bạn đang trống</Text><Button onPress={() => go('/')}>Khám phá sản phẩm →</Button></View> : <View style={[s.checkoutLayout, compact && { flexDirection: 'column', alignItems: 'stretch' }]}>
      <View style={{ flex: 1, gap: 24 }}>
        {checkout ? <View style={s.panel}>
          <Text style={s.sectionTitle}>Thông tin nhận hàng</Text>
          {!auth.ready ? <Text style={s.sectionSubtitle}>Đang kiểm tra phiên đăng nhập…</Text> : !auth.user ? <><Text style={s.sectionSubtitle}>Vui lòng đăng nhập để tạo đơn hàng và nhận thông báo.</Text><Button onPress={() => go('/login?redirect=/checkout')}>Đăng nhập để đặt hàng</Button></> : <Text style={s.sectionSubtitle}>{auth.user.name} · {auth.user.email}</Text>}
          <Field label="Địa chỉ nhận hàng" value={address} onChange={setAddress} placeholder="Số nhà, tên đường, phường/xã" />
          <Field label="Tỉnh / Thành phố" value={city} onChange={setCity} placeholder="Hà Nội" />
          <Field label="Mã bưu chính" value={postalCode} onChange={setPostalCode} placeholder="100000" />
          <Field label="Quốc gia" value={country} onChange={setCountry} />
          <Text style={s.fieldLabel}>Phương thức thanh toán</Text><View style={[s.paymentOption, { borderColor: green, backgroundColor: '#f0fdfa' }]}><Text style={{ color: green }}>◉ Thanh toán khi nhận hàng (COD)</Text></View>
          <Text style={s.sectionSubtitle}>Đơn hàng được tạo trên hệ thống khi bạn bấm Đặt hàng. Cổng thanh toán trực tuyến chưa được cung cấp bởi API này.</Text>
        </View> : lines.map(p => <View key={p.id} style={s.cartLine}><ProductImage uri={p.image} style={[s.cartImage, compact && { width: 80, height: 110 }]} /><View style={{ flex: 1, gap: 10 }}><Text style={s.productCategory}>{p.category}</Text><Text style={s.productName}>{p.name}</Text><Text style={s.price}>{money(p.price)}</Text><Text style={{ color: shop.cart[p.id] > p.stock ? '#dc2626' : '#64748b', fontSize: 11 }}>Còn {p.stock} sản phẩm</Text><View style={s.quantity}><Pressable disabled={shop.mutating} accessibilityLabel="Giảm số lượng" onPress={() => shop.quantity(p.id, shop.cart[p.id] - 1)}><Text style={s.quantityText}>−</Text></Pressable><Text>{shop.cart[p.id]}</Text><Pressable disabled={shop.mutating || shop.cart[p.id] >= p.stock} accessibilityLabel="Tăng số lượng" onPress={() => shop.quantity(p.id, shop.cart[p.id] + 1)}><Text style={s.quantityText}>+</Text></Pressable></View></View><Pressable disabled={shop.mutating} accessibilityLabel={`Xóa ${p.name}`} onPress={() => shop.quantity(p.id, 0)}><Icon name="close" size={18} /></Pressable></View>)}
        <Button secondary onPress={() => go(checkout ? '/cart' : '/')}>← {checkout ? 'Quay lại giỏ hàng' : 'Tiếp tục mua sắm'}</Button>
      </View>
      <View style={[s.summary, !compact && { width: 350 }]}>
        <Text style={s.sectionTitle}>Tóm tắt đơn hàng</Text>
        {checkout && lines.map(p => <View key={p.id} style={s.summaryRow}><Text style={[s.sectionSubtitle, { flex: 1 }]}>{p.name} × {shop.cart[p.id]}</Text><Text style={s.fieldLabel}>{money(p.price * shop.cart[p.id])}</Text></View>)}
        <View style={s.summaryRow}><Text style={s.sectionSubtitle}>Tạm tính</Text><Text>{money(totals.subtotal)}</Text></View><View style={s.summaryRow}><Text style={s.sectionSubtitle}>Phí vận chuyển</Text><Text style={{ color: green }}>{totals.shipping ? money(totals.shipping) : 'Miễn phí'}</Text></View>
        {shop.appliedCoupon && <><View style={s.summaryRow}><Text style={[s.sectionSubtitle, { flex: 1 }]}>{shop.discountCode} ({shop.appliedCoupon.percent}% trên sản phẩm phù hợp)</Text><Text style={{ color: green }}>−{money(totals.discount)}</Text></View><Pressable disabled={shop.mutating} onPress={() => { shop.clearCoupon(); setCoupon(''); }}><Text style={s.underlink}>Bỏ mã giảm giá</Text></Pressable></>}
        <View style={{ flexDirection: 'row', gap: 8 }}><TextInput accessibilityLabel="Mã giảm giá" editable={!shop.mutating} style={[s.field, { flex: 1, minWidth: 0 }]} value={coupon} onChangeText={setCoupon} placeholder="Mã giảm giá" autoCapitalize="characters" /><Button disabled={shop.mutating} secondary onPress={() => { void apply(); }}>Áp dụng</Button></View>
        {unavailable && <Text style={{ color: '#dc2626', fontSize: 12 }}>Một số sản phẩm không đủ tồn kho. Vui lòng điều chỉnh giỏ hàng.</Text>}
        {!!error && <Text accessibilityLiveRegion="polite" style={{ color: '#dc2626', fontSize: 12 }}>{error}</Text>}
        <View style={[s.summaryRow, { borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 20 }]}><Text style={s.productName}>Tổng dự kiến</Text><Text style={{ fontSize: 23, color: green }}>{money(totals.total)}</Text></View>
        <Button disabled={shop.mutating || unavailable || (checkout && !auth.ready)} onPress={() => { void submit(); }}>{shop.mutating ? 'Đang xử lý…' : checkout ? auth.user ? 'Đặt hàng →' : 'Đăng nhập để đặt hàng →' : 'Tiến hành thanh toán →'}</Button>
        <Text style={[s.sectionSubtitle, { fontSize: 11, textAlign: 'center' }]}>Giá và mã giảm giá được kiểm tra lại trước khi đặt hàng.</Text>
      </View>
    </View>}
  </>;
}
