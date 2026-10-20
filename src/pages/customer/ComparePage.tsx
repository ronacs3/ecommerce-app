import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { ProductImage } from '@/components/products/ProductImage';
import { green } from '@/constants/catalog';
import { useShop } from '@/hooks/useShop';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import type { Product } from '@/types/shop';
import { money } from '@/utils/money';

export default function ComparePage() {
  const { id, ids } = useLocalSearchParams<{ id?: string; ids?: string }>();
  const shop = useShop();
  const { notify, go, add } = useStoreUI();
  const { width } = useWindowDimensions();
  const desktop = width >= 860;

  // Selected products for comparison (up to 3)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const list: string[] = [];
    if (ids) {
      ids.split(',').forEach(item => {
        if (item && !list.includes(item)) list.push(item);
      });
    } else if (id) {
      list.push(id);
    }
    return list;
  });

  const [pickerSlot, setPickerSlot] = useState<number | null>(null);

  // Compute active IDs fallback if none explicitly selected
  const activeIds = selectedIds.length > 0
    ? selectedIds
    : shop.products.slice(0, 2).map(p => p.id);

  const comparedProducts: Product[] = activeIds
    .map(prodId => shop.products.find(p => p.id === prodId))
    .filter((p): p is Product => !!p);

  const handleRemove = (removeId: string) => {
    if (activeIds.length <= 1) {
      notify('Cần giữ ít nhất 1 sản phẩm để so sánh.');
      return;
    }
    setSelectedIds(activeIds.filter(itemId => itemId !== removeId));
  };

  const handleSelectProduct = (newId: string) => {
    if (pickerSlot !== null) {
      const next = [...selectedIds];
      if (pickerSlot < next.length) {
        next[pickerSlot] = newId;
      } else if (next.length < 3) {
        next.push(newId);
      }
      setSelectedIds([...new Set(next)]);
      setPickerSlot(null);
    }
  };

  const comparisonAttributes = [
    {
      title: 'Danh mục',
      render: (p: Product) => p.category,
    },
    {
      title: 'Đánh giá người dùng',
      render: (p: Product) => `★ ${p.rating ? p.rating.toFixed(1) : '4.8'} (${p.numReviews || 12} đánh giá)`,
    },
    {
      title: 'Tình trạng hàng',
      render: (p: Product) => p.stock > 0 ? `Còn hàng (${p.stock} máy)` : 'Tạm hết hàng',
      highlight: (p: Product) => p.stock > 0,
    },
    {
      title: 'Bảo hành chính hãng',
      render: () => '12 - 24 tháng chính hãng toàn quốc',
    },
    {
      title: 'Thông số kỹ thuật 1',
      render: (p: Product) => p.specs?.[0] || 'Thiết kế cao cấp thế hệ mới',
    },
    {
      title: 'Thông số kỹ thuật 2',
      render: (p: Product) => p.specs?.[1] || 'Hiệu năng tối ưu tiết kiệm pin',
    },
    {
      title: 'Màu sắc khả dụng',
      render: (p: Product) => p.colors?.length ? p.colors.join(', ') : 'Đen titan, Bạc sang trọng',
    },
    {
      title: 'Ưu đãi đi kèm',
      render: () => 'Miễn phí giao hàng, tặng voucher 10%',
    },
  ];

  return (
    <View style={{ gap: 32 }}>
      {/* Page Heading */}
      <View style={s.pageHeading}>
        <Text style={s.eyebrow}>CÔNG CỤ ĐỐI CHIẾU CẤU HÌNH</Text>
        <Text style={s.pageTitle}>So sánh thiết bị</Text>
        <Text style={[s.sectionSubtitle, { maxWidth: 800 }]}>
          Đặt các sản phẩm cạnh nhau để so sánh chi tiết về giá cả, cấu hình phần cứng, tính năng và chế độ bảo hành.
        </Text>
      </View>

      {/* Comparison Table / Grid */}
      <View style={[s.panel, { padding: desktop ? 24 : 16 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <Text style={[s.sectionTitle, { fontSize: 18 }]}>
            So sánh {comparedProducts.length} sản phẩm
          </Text>
          {selectedIds.length < 3 && (
            <Pressable
              onPress={() => setPickerSlot(selectedIds.length)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#f0fdfa', borderRadius: 8, borderWidth: 1, borderColor: '#ccfbf1' }}
            >
              <Icon name="tag" size={15} color={green} />
              <Text style={{ fontSize: 12, color: green, fontWeight: '700' }}>+ Thêm sản phẩm thứ {selectedIds.length + 1}</Text>
            </Pressable>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={{ minWidth: desktop ? 750 : 620, gap: 16 }}>
            {/* Header Cards Row */}
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 20 }}>
              <View style={{ width: 160, justifyContent: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748b' }}>SẢN PHẨM</Text>
              </View>
              {comparedProducts.map((p, idx) => (
                <View key={p.id} style={{ width: 220, paddingHorizontal: 10, gap: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable onPress={() => setPickerSlot(idx)}>
                      <Text style={s.underlink}>Đổi máy</Text>
                    </Pressable>
                    <Pressable onPress={() => handleRemove(p.id)} hitSlop={8}>
                      <Icon name="close" size={16} color="#94a3b8" />
                    </Pressable>
                  </View>
                  <View style={{ width: '100%', height: 140, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}>
                    <ProductImage uri={p.image} style={{ width: '100%', height: '100%' }} />
                  </View>
                  <Pressable onPress={() => go(`/product?id=${p.id}`)}>
                    <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: '700', color: '#0f172a', minHeight: 36 }}>{p.name}</Text>
                  </Pressable>
                  <Text style={[s.price, { fontSize: 16 }]}>{money(p.price)}</Text>
                  <Button disabled={!p.stock} onPress={() => add(p)}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Thêm vào giỏ</Text>
                  </Button>
                </View>
              ))}
            </View>

            {/* Spec Rows */}
            {comparisonAttributes.map(attr => (
              <View key={attr.title} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 12 }}>
                <View style={{ width: 160, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#475569' }}>{attr.title}</Text>
                </View>
                {comparedProducts.map(p => {
                  const val = attr.render(p);
                  const isHigh = attr.highlight ? attr.highlight(p) : false;
                  return (
                    <View key={p.id} style={{ width: 220, paddingHorizontal: 10, justifyContent: 'center' }}>
                      <Text style={{ fontSize: 13, color: isHigh ? green : '#0f172a', fontWeight: isHigh ? '700' : '400' }}>
                        {val}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Modal Picker for Choosing Product to Compare */}
      <Modal visible={pickerSlot !== null} transparent animationType="fade" onRequestClose={() => setPickerSlot(null)}>
        <View style={s.modalOverlay}>
          <View style={[s.productModal, { maxHeight: '80%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={s.sectionTitle}>Chọn sản phẩm so sánh</Text>
              <Pressable onPress={() => setPickerSlot(null)} hitSlop={8}>
                <Icon name="close" size={20} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {shop.products.map(item => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <Pressable
                    key={item.id}
                    disabled={isSelected}
                    onPress={() => handleSelectProduct(item.id)}
                    style={[
                      s.orderRow,
                      { paddingVertical: 10, opacity: isSelected ? 0.4 : 1, backgroundColor: isSelected ? '#f8fafc' : '#fff' }
                    ]}
                  >
                    <View style={{ width: 45, height: 45, borderRadius: 6, overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                      <ProductImage uri={item.image} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>{item.name}</Text>
                      <Text style={{ fontSize: 11, color: '#64748b' }}>{item.category} • {money(item.price)}</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: isSelected ? '#94a3b8' : green, fontWeight: '700' }}>
                      {isSelected ? 'Đang chọn' : 'So sánh →'}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
