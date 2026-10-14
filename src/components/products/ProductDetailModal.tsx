import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { useShop } from '@/hooks/useShop';
import { getProduct } from '@/services/api/catalog';
import { errorMessage } from '@/services/api/http';
import { s } from '@/styles/store';
import type { Product } from '@/types/shop';
import { money } from '@/utils/money';
import { ProductImage } from './ProductImage';

function ProductDetails({ selected, compact, add }: { selected: Product; compact: boolean; add: (product: Product) => void }) {
  const shop = useShop();
  const [product, setProduct] = useState(selected);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    getProduct(selected.id, shop.categories).then(p => { if (!cancelled) setProduct(p); }).catch(e => { if (!cancelled) setError(errorMessage(e)); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selected.id, shop.categories]);
  return <ScrollView showsVerticalScrollIndicator={false}>
    <ProductImage uri={product.image} style={{ width: '100%', height: compact ? 240 : 300, borderRadius: 10 }} />
    <View style={{ gap: 16, paddingTop: 23 }}><Text style={s.eyebrow}>{product.category}</Text><Text style={s.sectionTitle}>{product.name}</Text><Text style={[s.price, { fontSize: 25 }]}>{money(product.price)}</Text>
      {loading && <Text style={s.sectionSubtitle}>Đang cập nhật chi tiết sản phẩm…</Text>}{!!error && <Text style={{ color: '#dc2626', fontSize: 12 }}>{error}</Text>}
      <Text style={s.fieldLabel}>Mô tả sản phẩm</Text><Text style={s.sectionSubtitle}>{product.description || 'Chưa có mô tả.'}</Text>
      {!!product.numReviews && <Text style={s.sectionSubtitle}>★ {product.rating?.toFixed(1)} · {product.numReviews} đánh giá</Text>}
      <View style={{ padding: 15, borderRadius: 8, backgroundColor: '#f0fdfa' }}><Text style={{ fontSize: 12, color: '#115e59', lineHeight: 22 }}>✓ Còn {product.stock} sản phẩm{String.fromCharCode(10)}✓ Miễn phí giao hàng cho đơn từ 500.000đ</Text></View>
      <Button disabled={loading || !!error || !product.stock} onPress={() => add(product)}>{product.stock ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng'}</Button><Button secondary onPress={() => shop.favorite(product.id)}>{shop.favorites.includes(product.id) ? 'Đã lưu yêu thích ♥' : 'Thêm vào yêu thích ♡'}</Button>
    </View>
  </ScrollView>;
}
export function ProductDetailModal({ selected, setSelected, compact, add }: { selected: Product | null; setSelected: (product: Product | null) => void; compact: boolean; add: (product: Product) => void }) {
  return <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}><View style={s.modalOverlay}><Pressable style={s.absoluteFill} onPress={() => setSelected(null)} /><View style={s.productModal}><Pressable accessibilityLabel="Đóng chi tiết" style={s.modalClose} onPress={() => setSelected(null)}><Icon name="close" size={19} /></Pressable>{selected && <ProductDetails key={selected.id} selected={selected} compact={compact} add={add} />}</View></View></Modal>;
}
