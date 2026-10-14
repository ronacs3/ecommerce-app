import { Button } from '@/components/common/Button';
import { green } from '@/constants/catalog';
import { useAuth } from '@/hooks/useAuth';
import { useShop } from '@/hooks/useShop';
import { errorMessage } from '@/services/api/http';
import { s } from '@/styles/store';
import type { Order, OrderAction } from '@/types/shop';
import { money } from '@/utils/money';
import { useState } from 'react';
import { Modal, Text, View } from 'react-native';

export function OrderList({ admin = false }: { admin?: boolean }) {
  const shop = useShop();
  const auth = useAuth();
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<{ order: Order; action: OrderAction } | null>(null);
  const orders = admin ? shop.orders : shop.orders.filter(o => o.userId === auth.user?.id);
  const labels = { cancel: 'Hủy đơn hàng', pay: 'Xác nhận thanh toán', deliver: 'Xác nhận đã giao' };
  async function change() {
    if (!confirm) return;
    setError('');
    try { await shop.updateOrder(confirm.order.id, confirm.action); setConfirm(null); } catch (e) { setError(errorMessage(e)); }
  }
  return <View style={s.panel}>
    <View style={[s.summaryRow, { flexWrap: 'wrap' }]}><Text style={s.sectionTitle}>{admin ? 'Đơn hàng hệ thống' : 'Đơn hàng của bạn'}</Text><Button disabled={shop.privateLoading} secondary onPress={() => { void shop.refreshPrivate(); }}>Làm mới</Button></View>
    {!!(shop.privateError || error) && <Text style={{ color: '#dc2626', fontSize: 12 }}>{error || shop.privateError}</Text>}
    {shop.privateLoading && <Text style={s.sectionSubtitle}>Đang tải đơn hàng…</Text>}
    {!shop.privateLoading && !orders.length && !shop.privateError && <Text style={[s.sectionSubtitle, { paddingVertical: 25 }]}>Chưa có đơn hàng.</Text>}
    {orders.map(o => <View key={o.id} style={[s.orderRow, { flexWrap: 'wrap' }]}><View style={{ flex: 1, minWidth: 180, gap: 8 }}><Text style={s.productName}>#{o.id}</Text><Text style={s.sectionSubtitle}>{o.name} · {new Date(o.date).toLocaleDateString('vi-VN')}</Text><Text style={s.sectionSubtitle}>{o.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}</Text><Text style={s.sectionSubtitle}>{o.address}</Text>{admin && !!o.email && <Text style={s.sectionSubtitle}>{o.email}</Text>}<Text style={{ color: '#64748b', fontSize: 11 }}>{o.payment} · {o.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</Text></View><View style={{ alignItems: 'flex-end', gap: 12 }}><Text style={s.price}>{money(o.total)}</Text><View style={s.statusPill}><Text style={{ color: green, fontSize: 11 }}>{o.status}</Text></View><View style={{ gap: 8 }}>{admin && !o.isCancelled && !o.isPaid && <Button disabled={shop.mutating} secondary onPress={() => { setError(''); setConfirm({ order: o, action: 'pay' }); }}>Xác nhận thanh toán</Button>}{admin && !o.isCancelled && !o.isDelivered && <Button disabled={shop.mutating} secondary onPress={() => { setError(''); setConfirm({ order: o, action: 'deliver' }); }}>Đánh dấu đã giao</Button>}{!o.isCancelled && !o.isDelivered && <Button disabled={shop.mutating} secondary onPress={() => { setError(''); setConfirm({ order: o, action: 'cancel' }); }}>Hủy đơn hàng</Button>}</View></View></View>)}
    <Modal visible={!!confirm} transparent animationType="fade" onRequestClose={() => { if (!shop.mutating) setConfirm(null); }}><View style={s.modalOverlay}><View style={s.productModal}><Text style={s.sectionTitle}>{confirm ? labels[confirm.action] : ''}?</Text><Text style={[s.sectionSubtitle, { marginVertical: 20 }]}>Đơn hàng #{confirm?.order.id}{String.fromCharCode(10)}Thao tác này sẽ cập nhật trạng thái trên hệ thống.</Text>{!!error && <Text style={{ color: '#dc2626', marginBottom: 16 }}>{error}</Text>}<Button disabled={shop.mutating} onPress={() => { void change(); }}>{shop.mutating ? 'Đang xử lý…' : 'Xác nhận'}</Button><View style={{ height: 12 }} /><Button disabled={shop.mutating} secondary onPress={() => setConfirm(null)}>Quay lại</Button></View></View></Modal>
  </View>;
}
