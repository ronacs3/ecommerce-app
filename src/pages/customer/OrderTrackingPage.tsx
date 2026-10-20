import { useState } from 'react';
import { Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { ProductImage } from '@/components/products/ProductImage';
import { green } from '@/constants/catalog';
import { useAuth } from '@/hooks/useAuth';
import { useShop } from '@/hooks/useShop';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import type { Order } from '@/types/shop';
import { money } from '@/utils/money';

export default function OrderTrackingPage() {
  const { id: queryId } = useLocalSearchParams<{ id?: string }>();
  const shop = useShop();
  const auth = useAuth();
  const { notify, go } = useStoreUI();
  const { width } = useWindowDimensions();
  const desktop = width >= 800;

  const [searchId, setSearchId] = useState(queryId || '');
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (queryId) {
      return shop.orders.find(o => o.id === queryId) || null;
    }
    return shop.orders[0] || null;
  });

  const handleSearch = () => {
    const clean = searchId.trim().toLowerCase();
    if (!clean) {
      notify('Vui lòng nhập mã đơn hàng hoặc email.');
      return;
    }
    const match = shop.orders.find(o => o.id.toLowerCase().includes(clean) || o.email.toLowerCase().includes(clean));
    if (match) {
      setActiveOrder(match);
      notify(`Đã tìm thấy đơn hàng #${match.id.slice(-6).toUpperCase()}`);
    } else {
      // Fallback demo order for previewing the feature
      const demoOrder: Order = {
        id: clean.startsWith('ord') ? clean : `ORD-${clean.toUpperCase().slice(0, 8)}`,
        userId: auth.user?.id || 'demo-user',
        name: auth.user?.name || 'Khách hàng TechShop',
        email: auth.user?.email || 'khachhang@techshop.vn',
        address: '123 Đường Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
        payment: 'COD (Thanh toán khi nhận hàng)',
        total: 18500000,
        status: 'Đang vận chuyển',
        date: new Date().toLocaleDateString('vi-VN'),
        isPaid: false,
        isDelivered: false,
        isCancelled: false,
        items: [
          { productId: shop.products[0]?.id || 'p-1', name: shop.products[0]?.name || 'Laptop Ultra TechBook 14"', quantity: 1 }
        ]
      };
      setActiveOrder(demoOrder);
      notify('Hiển thị tiến trình đơn hàng mô phỏng.');
    }
  };

  const steps = [
    { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tiếp nhận trên hệ thống', time: '10:30, 20/10/2026', done: true, icon: 'check' },
    { title: 'TechShop xác nhận', desc: 'Nhân viên đã kiểm tra và chuẩn bị xuất kho', time: '11:15, 20/10/2026', done: true, icon: 'check-circle' },
    { title: 'Đang đóng gói', desc: 'Kiểm tra tem niêm phong và đóng gói cẩn thận', time: '13:40, 20/10/2026', done: true, icon: 'box' },
    { title: 'Đang vận chuyển', desc: 'Đơn vị vận chuyển GHTK Express đang phát hàng', time: '15:20, 20/10/2026', done: activeOrder ? !activeOrder.isCancelled : true, active: true, icon: 'truck' },
    { title: 'Giao hàng thành công', desc: 'Khách hàng kiểm tra và ký nhận bưu kiện', time: 'Dự kiến hôm nay', done: activeOrder?.isDelivered || false, icon: 'home' },
  ];

  return (
    <View style={{ gap: 28 }}>
      {/* Page Heading */}
      <View style={s.pageHeading}>
        <Text style={s.eyebrow}>THEO DÕI HÀNH TRÌNH BƯU KIỆN</Text>
        <Text style={s.pageTitle}>Tra cứu đơn hàng</Text>
        <Text style={s.sectionSubtitle}>
          Nhập mã đơn hàng hoặc địa chỉ email của bạn để theo dõi vị trí và tiến độ giao hàng trực tiếp 24/7.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[s.panel, { padding: 24, gap: 16 }]}>
        <Text style={[s.sectionTitle, { fontSize: 18 }]}>Tìm kiếm đơn hàng</Text>
        <View style={{ flexDirection: desktop ? 'row' : 'column', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              value={searchId}
              onChangeText={setSearchId}
              placeholder="Nhập mã đơn hàng (Ví dụ: ORD-12345 hoặc email đặt hàng)..."
              placeholderTextColor="#94a3b8"
              style={s.field}
              onSubmitEditing={handleSearch}
            />
          </View>
          <View style={{ width: desktop ? 160 : '100%' }}>
            <Button onPress={handleSearch}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="search" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Tra cứu</Text>
              </View>
            </Button>
          </View>
        </View>

        {/* Quick select recent orders if available */}
        {shop.orders.length > 0 && (
          <View style={{ gap: 8, marginTop: 4 }}>
            <Text style={{ fontSize: 12, color: '#64748b', fontWeight: '600' }}>Đơn hàng gần đây của bạn:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {shop.orders.slice(0, 4).map(o => (
                <Pressable
                  key={o.id}
                  onPress={() => {
                    setActiveOrder(o);
                    setSearchId(o.id);
                  }}
                  style={[
                    s.filter,
                    activeOrder?.id === o.id && s.filterActive,
                    { paddingVertical: 6, paddingHorizontal: 12 }
                  ]}
                >
                  <Text style={{ fontSize: 12, color: activeOrder?.id === o.id ? '#fff' : '#0f172a', fontWeight: '600' }}>
                    #{o.id.slice(-6).toUpperCase()} • {money(o.total)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Order Details and Stepper */}
      {activeOrder ? (
        <View style={{ gap: 24 }}>
          {/* Status banner */}
          <View style={[s.panel, { backgroundColor: '#f0fdfa', borderColor: '#ccfbf1', padding: 20 }]}>
            <View style={{ flexDirection: desktop ? 'row' : 'column', justifyContent: 'space-between', alignItems: desktop ? 'center' : 'flex-start', gap: 14 }}>
              <View style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a' }}>
                    Đơn hàng #{activeOrder.id.slice(-8).toUpperCase()}
                  </Text>
                  <View style={[s.statusPill, { backgroundColor: activeOrder.isCancelled ? '#fef2f2' : activeOrder.isDelivered ? '#f0fdf4' : '#e0f2fe' }]}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: activeOrder.isCancelled ? '#dc2626' : activeOrder.isDelivered ? '#16a34a' : '#0284c7' }}>
                      {activeOrder.status || 'Đang vận chuyển'}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: '#64748b' }}>Ngày đặt hàng: {activeOrder.date} • Phương thức: {activeOrder.payment}</Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  onPress={() => {
                    notify('Đã sao chép mã vận đơn: GHTK-VN8920199');
                  }}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 7, borderWidth: 1, borderColor: '#cbd5e1' }}
                >
                  <Icon name="copy" size={14} color="#475569" />
                  <Text style={{ fontSize: 12, color: '#475569', fontWeight: '600' }}>Sao chép mã bưu phẩm</Text>
                </Pressable>
                <Pressable
                  onPress={() => go(`/contact?orderId=${activeOrder.id}`)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: green, borderRadius: 7 }}
                >
                  <Icon name="support" size={14} color="#fff" />
                  <Text style={{ fontSize: 12, color: '#fff', fontWeight: '600' }}>Cần hỗ trợ</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Stepper Timeline */}
          <View style={[s.panel, { padding: 24, gap: 20 }]}>
            <Text style={[s.sectionTitle, { fontSize: 18 }]}>Tiến trình giao hàng</Text>
            <View style={{ gap: 20 }}>
              {steps.map((step, idx) => (
                <View key={step.title} style={{ flexDirection: 'row', gap: 16 }}>
                  {/* Timeline icon & vertical connector */}
                  <View style={{ alignItems: 'center' }}>
                    <View
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 20,
                        backgroundColor: step.done ? green : step.active ? '#e0f2fe' : '#f1f5f9',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: step.active ? '#0284c7' : step.done ? green : '#cbd5e1',
                      }}
                    >
                      <Icon name={step.icon} size={18} color={step.done ? '#fff' : step.active ? '#0284c7' : '#94a3b8'} />
                    </View>
                    {idx < steps.length - 1 && (
                      <View style={{ width: 2, height: 40, backgroundColor: step.done ? green : '#e2e8f0', marginVertical: 4 }} />
                    )}
                  </View>

                  {/* Step information */}
                  <View style={{ flex: 1, paddingTop: 4, gap: 4 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: step.done || step.active ? '#0f172a' : '#94a3b8' }}>
                        {step.title}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#64748b' }}>{step.time}</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: '#64748b' }}>{step.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Recipient & Products Breakdown */}
          <View style={{ flexDirection: desktop ? 'row' : 'column', gap: 20 }}>
            {/* Recipient Details */}
            <View style={[s.panel, { flex: 1, padding: 20, gap: 14 }]}>
              <Text style={[s.sectionTitle, { fontSize: 16 }]}>Địa chỉ nhận hàng</Text>
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>{activeOrder.name}</Text>
                <Text style={{ fontSize: 13, color: '#475569' }}>Email: {activeOrder.email}</Text>
                <Text style={{ fontSize: 13, color: '#475569', lineHeight: 20 }}>Địa chỉ: {activeOrder.address}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <Icon name="truck" size={15} color={green} />
                  <Text style={{ fontSize: 12, color: green, fontWeight: '600' }}>Giao hàng hỏa tốc trong 24-48 giờ</Text>
                </View>
              </View>
            </View>

            {/* Items summary */}
            <View style={[s.panel, { flex: 1.2, padding: 20, gap: 14 }]}>
              <Text style={[s.sectionTitle, { fontSize: 16 }]}>Sản phẩm trong đơn hàng ({activeOrder.items.length})</Text>
              <View style={{ gap: 12 }}>
                {activeOrder.items.map((item, idx) => {
                  const productObj = shop.products.find(p => p.id === item.productId || p.name === item.name);
                  return (
                    <View key={idx} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 10 }}>
                      <View style={{ width: 50, height: 50, borderRadius: 6, overflow: 'hidden', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}>
                        <ProductImage uri={productObj?.image || ''} style={{ width: '100%', height: '100%' }} />
                      </View>
                      <View style={{ flex: 1, gap: 3 }}>
                        <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>{item.name}</Text>
                        <Text style={{ fontSize: 11, color: '#64748b' }}>Số lượng: x{item.quantity}</Text>
                      </View>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: green }}>
                        {productObj ? money(productObj.price * item.quantity) : money(activeOrder.total)}
                      </Text>
                    </View>
                  );
                })}
                <View style={[s.summaryRow, { marginTop: 6 }]}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>Tổng thanh toán</Text>
                  <Text style={[s.price, { fontSize: 20 }]}>{money(activeOrder.total)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={s.empty}>
          <Icon name="truck" size={44} color="#94a3b8" />
          <Text style={s.sectionTitle}>Chưa có đơn hàng nào được chọn</Text>
          <Text style={s.sectionSubtitle}>Nhập mã đơn hàng ở trên để kiểm tra lộ trình vận chuyển.</Text>
          <Button onPress={() => go('/shop')}>Tiếp tục mua sắm</Button>
        </View>
      )}
    </View>
  );
}
