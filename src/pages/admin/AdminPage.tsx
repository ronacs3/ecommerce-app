import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { Icon } from '@/components/common/Icon';
import { OrderList } from '@/components/orders/OrderList';
import { ProductImage } from '@/components/products/ProductImage';
import { green } from '@/constants/catalog';
import { useAuth } from '@/hooks/useAuth';
import { useShop } from '@/hooks/useShop';
import { useStoreUI } from '@/hooks/useStoreUI';
import { errorMessage } from '@/services/api/http';
import { s } from '@/styles/store';
import type { Product } from '@/types/shop';
import { money } from '@/utils/money';

export default function AdminPage() {
  const auth = useAuth();
  const shop = useShop();
  const { compact, notify, go } = useStoreUI();
  const [tab, setTab] = useState('Tổng quan');
  const [edit, setEdit] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<{ id: string; type: 'product' | 'coupon' } | null>(null);
  const [code, setCode] = useState('');
  const [percent, setPercent] = useState('');
  const [expiry, setExpiry] = useState('');
  const [scope, setScope] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  if (!auth.ready) return <View style={s.empty}><Text>Đang kiểm tra quyền truy cập…</Text></View>;
  if (!auth.user) return <View style={s.empty}><Icon name="shield" size={40} color={green} /><Text style={s.sectionTitle}>Đăng nhập bằng tài khoản quản trị</Text><Button onPress={() => go('/login?redirect=/admin')}>Đăng nhập</Button></View>;
  if (!auth.user.isAdmin) return <View style={s.empty}><Text style={s.sectionTitle}>Bạn không có quyền quản trị</Text><Text style={s.sectionSubtitle}>Trang này chỉ dành cho tài khoản Admin.</Text><Button onPress={() => go('/account')}>Về tài khoản</Button></View>;
  const sales = shop.orders.filter(o => o.isPaid && !o.isCancelled).reduce((sum, o) => sum + o.total, 0);
  async function save() {
    if (!edit) return;
    setFormError('');
    if (!edit.name.trim() || !edit.description?.trim() || !Number.isFinite(edit.price) || edit.price <= 0 || !Number.isInteger(edit.stock) || edit.stock < 0 || !edit.image || !edit.categoryId) { setFormError('Nhập tên, mô tả, danh mục, ảnh, giá hợp lệ và tồn kho nguyên không âm.'); return; }
    try { await shop.updateProduct(edit); setEdit(null); notify('Đã lưu sản phẩm trên API.'); } catch (e) { setFormError(errorMessage(e)); }
  }
  async function deleteSelected() {
    if (!deleting) return;
    setFormError('');
    try { if (deleting.type === 'product') await shop.deleteProduct(deleting.id); else await shop.deleteCoupon(deleting.id); setDeleting(null); notify('Đã xóa trên hệ thống.'); } catch (e) { setFormError(errorMessage(e)); }
  }
  async function addCoupon() {
    setError('');
    const clean = code.trim().toUpperCase();
    const value = Number(percent);
    const date = new Date(`${expiry}T23:59:59+07:00`);
    if (!/^[A-Z0-9_-]{3,30}$/.test(clean) || !Number.isFinite(value) || value <= 0 || value > 100 || !/^\d{4}-\d{2}-\d{2}$/.test(expiry) || !Number.isFinite(date.getTime()) || date <= new Date()) { setError('Nhập mã, tỷ lệ giảm 1–100% và ngày hết hạn trong tương lai (YYYY-MM-DD).'); return; }
    try {
      const applicableCategories = shop.categories.filter(c => scope.includes(c.id)).flatMap(c => [c.id, c.name]);
      await shop.updateCoupon({ code: clean, percent: value, active: true, expirationDate: date.toISOString(), applicableCategories });
      setCode(''); setPercent(''); setExpiry(''); setScope([]); notify('Đã tạo mã giảm giá.');
    } catch (e) { setError(errorMessage(e)); }
  }
  return <>
    <View style={s.pageHeading}><Text style={s.eyebrow}>TECHSHOP / QUẢN TRỊ</Text><Text style={s.pageTitle}>Quản trị cửa hàng</Text><Text style={s.sectionSubtitle}>Xin chào {auth.user.name}. Dữ liệu được tải trực tiếp từ hệ thống.</Text><View style={{ alignSelf: 'flex-start' }}><Button secondary disabled={shop.privateLoading || shop.loading} onPress={() => { void Promise.all([shop.refresh(), shop.refreshPrivate()]).catch(e => notify(errorMessage(e))); }}>Làm mới dữ liệu</Button></View></View>
    {!!shop.privateError && <View style={[s.panel, { marginBottom: 20 }]}><Text style={{ color: '#dc2626' }}>{shop.privateError}</Text></View>}
    {shop.privateLoading && <Text style={[s.sectionSubtitle, { marginBottom: 20 }]}>Đang tải dữ liệu quản trị…</Text>}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 25 }}>{['Tổng quan', 'Sản phẩm', 'Đơn hàng', 'Mã giảm giá', 'Khách hàng'].map(t => <Pressable key={t} onPress={() => { setTab(t); setError(''); }} style={[s.filter, tab === t && s.filterActive]}><Text style={{ color: tab === t ? '#fff' : green }}>{t}</Text></Pressable>)}</ScrollView>
    {tab === 'Tổng quan' && <>
      <View style={s.stats}>{[['Doanh thu đã thanh toán', money(sales)], ['Đơn hàng', String(shop.orders.length)], ['Sản phẩm', String(shop.products.length)], ['Khách hàng', String(shop.users.filter(u => !u.isAdmin).length)]].map(([label, value]) => <View key={label} style={[s.stat, { width: compact ? '47%' : '23%' }]}><Text style={s.sectionSubtitle}>{label}</Text><Text numberOfLines={1} adjustsFontSizeToFit style={[s.pageTitle, { fontSize: label.startsWith('Doanh thu') ? 20 : 32 }]}>{value}</Text></View>)}</View>
      {shop.stats && <View style={[s.panel, { marginBottom: 25 }]}><Text style={s.sectionTitle}>Thống kê 7 ngày gần nhất</Text>{!shop.stats.dailyOrders.length && <Text style={s.sectionSubtitle}>Chưa có dữ liệu trong 7 ngày gần nhất.</Text>}{shop.stats.dailyOrders.map(day => <View key={day._id} style={s.summaryRow}><Text style={s.sectionSubtitle}>{day._id} · {day.count} đơn</Text><Text style={s.price}>{money(day.totalSales)}</Text></View>)}<Text style={s.fieldLabel}>Sản phẩm bán nhiều nhất</Text>{shop.stats.topProducts.map(p => <Text key={p._id} style={s.sectionSubtitle}>{p.name} · {p.totalQty} sản phẩm</Text>)}</View>}
      <OrderList admin />
    </>}
    {tab === 'Đơn hàng' && <OrderList admin />}
    {tab === 'Sản phẩm' && <View style={s.panel}><View style={[s.summaryRow, { flexWrap: 'wrap' }]}><Text style={s.sectionTitle}>Danh sách sản phẩm</Text><Button disabled={shop.mutating || !shop.categories.length} onPress={() => { setFormError(''); const category = shop.categories[0]; setEdit({ id: '', name: '', category: category.label, categoryId: category.id, categoryKey: category.id, description: '', price: 0, stock: 0, image: '', colors: [] }); }}>+ Thêm sản phẩm</Button></View>{shop.products.map(p => <View key={p.id} style={s.orderRow}><ProductImage uri={p.image} style={{ width: compact ? 45 : 65, height: 70, borderRadius: 7 }} /><View style={{ flex: 1, gap: 6 }}><Text style={s.productName}>{p.name}</Text><Text style={s.sectionSubtitle}>{p.category} · {p.stock} tồn kho · {money(p.price)}</Text></View><Pressable disabled={shop.mutating} onPress={() => { setFormError(''); setEdit(p); }}><Text style={s.underlink}>Sửa</Text></Pressable><Pressable disabled={shop.mutating} onPress={() => { setFormError(''); setDeleting({ id: p.id, type: 'product' }); }}><Text style={{ color: '#dc2626', fontSize: 12 }}>Xóa</Text></Pressable></View>)}</View>}
    {tab === 'Mã giảm giá' && <View style={s.panel}><Text style={s.sectionTitle}>Quản lý mã giảm giá</Text>{shop.coupons.map(c => <View key={c.id || c.code} style={s.orderRow}><View style={{ flex: 1 }}><Text style={s.productName}>{c.code}</Text><Text style={s.sectionSubtitle}>{c.percent}% · {c.active ? 'Đang bật' : 'Đã tắt'} · Hết hạn {c.expirationDate ? new Date(c.expirationDate).toLocaleDateString('vi-VN') : '—'}</Text><Text style={s.sectionSubtitle}>{c.applicableCategories?.length ? `Áp dụng: ${[...new Set(c.applicableCategories.map(key => shop.categories.find(cat => cat.id === key || cat.name === key)?.label || key))].join(', ')}` : 'Áp dụng tất cả danh mục'}</Text></View><Button disabled={shop.mutating || !c.id} secondary onPress={() => { setFormError(''); if (c.id) setDeleting({ id: c.id, type: 'coupon' }); }}>Xóa</Button></View>)}<Field label="Mã giảm giá mới" value={code} onChange={setCode} placeholder="SALE10" /><Field label="Tỷ lệ giảm (1–100%)" value={percent} onChange={setPercent} numeric /><Field label="Ngày hết hạn (YYYY-MM-DD)" value={expiry} onChange={setExpiry} placeholder="2026-12-31" /><Text style={s.fieldLabel}>Danh mục áp dụng · để trống là tất cả</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{shop.categories.map(c => <Pressable key={c.id} style={[s.filter, scope.includes(c.id) && s.filterActive]} onPress={() => setScope(s => s.includes(c.id) ? s.filter(id => id !== c.id) : [...s, c.id])}><Text style={{ color: scope.includes(c.id) ? '#fff' : green, fontSize: 12 }}>{c.label}</Text></Pressable>)}</View>{!!error && <Text style={{ color: '#dc2626', fontSize: 12 }}>{error}</Text>}<Button disabled={shop.mutating} onPress={() => { void addCoupon(); }}>{shop.mutating ? 'Đang xử lý…' : 'Tạo mã giảm giá'}</Button></View>}
    {tab === 'Khách hàng' && <View style={s.panel}><Text style={s.sectionTitle}>Người dùng hệ thống</Text>{shop.users.map(u => <View key={u.id} style={s.orderRow}><View style={{ flex: 1 }}><Text style={s.productName}>{u.name}</Text><Text style={s.sectionSubtitle}>{u.email}</Text></View><View style={s.statusPill}><Text style={{ color: green, fontSize: 11 }}>{u.isAdmin ? 'Admin' : 'Khách hàng'}</Text></View></View>)}</View>}
    <Modal visible={!!edit} transparent animationType="fade" onRequestClose={() => { if (!shop.mutating) setEdit(null); }}><View style={s.modalOverlay}><View style={s.productModal}><Pressable disabled={shop.mutating} accessibilityLabel="Đóng chỉnh sửa" style={s.modalClose} onPress={() => setEdit(null)}><Icon name="close" /></Pressable>{edit && <ScrollView contentContainerStyle={{ gap: 18 }}><Text style={s.sectionTitle}>{edit.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</Text><Field label="Tên sản phẩm" value={edit.name} onChange={name => setEdit({ ...edit, name })} /><Field label="Mô tả" value={edit.description || ''} onChange={description => setEdit({ ...edit, description })} /><Text style={s.fieldLabel}>Danh mục</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{shop.categories.map(c => <Pressable key={c.id} style={[s.filter, c.id === edit.categoryId && s.filterActive]} onPress={() => setEdit({ ...edit, category: c.label, categoryId: c.id, categoryKey: c.id })}><Text style={{ color: c.id === edit.categoryId ? '#fff' : green, fontSize: 12 }}>{c.label}</Text></Pressable>)}</View><Field label="Giá (VNĐ)" value={String(edit.price)} numeric onChange={v => setEdit({ ...edit, price: Number(v) })} /><Field label="Tồn kho" value={String(edit.stock)} numeric onChange={v => setEdit({ ...edit, stock: Number(v) })} /><Field label="Đường dẫn ảnh" value={edit.image} onChange={image => setEdit({ ...edit, image })} />{!!formError && <Text style={{ color: '#dc2626', fontSize: 12 }}>{formError}</Text>}<Button disabled={shop.mutating} onPress={() => { void save(); }}>{shop.mutating ? 'Đang lưu…' : 'Lưu sản phẩm'}</Button></ScrollView>}</View></View></Modal>
    <Modal visible={!!deleting} transparent animationType="fade" onRequestClose={() => { if (!shop.mutating) setDeleting(null); }}><View style={s.modalOverlay}><View style={s.productModal}><Text style={s.sectionTitle}>Xóa {deleting?.type === 'product' ? 'sản phẩm' : 'mã giảm giá'}?</Text><Text style={[s.sectionSubtitle, { marginVertical: 20 }]}>Dữ liệu sẽ được xóa trên backend.</Text>{!!formError && <Text style={{ color: '#dc2626', marginBottom: 16 }}>{formError}</Text>}<Button disabled={shop.mutating} onPress={() => { void deleteSelected(); }}>{shop.mutating ? 'Đang xóa…' : 'Xác nhận xóa'}</Button><View style={{ height: 12 }} /><Button disabled={shop.mutating} secondary onPress={() => setDeleting(null)}>Quay lại</Button></View></View></Modal>
  </>;
}
