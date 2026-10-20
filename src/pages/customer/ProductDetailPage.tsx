import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductImage } from '@/components/products/ProductImage';
import { green } from '@/constants/catalog';
import { useShop } from '@/hooks/useShop';
import { useStoreUI } from '@/hooks/useStoreUI';
import { getProduct } from '@/services/api/catalog';
import { errorMessage } from '@/services/api/http';
import { s } from '@/styles/store';
import type { Product } from '@/types/shop';
import { money } from '@/utils/money';

type Review = { id: string; author: string; rating: number; date: string; content: string; verified: boolean };

const initialReviews: Review[] = [
  { id: 'rev-1', author: 'Nguyễn Văn Minh', rating: 5, date: '15/10/2026', content: 'Sản phẩm nguyên seal chính hãng, đóng gói cực kỳ cẩn thận. Giao hàng nhanh tại Hà Nội chỉ sau 1 ngày.', verified: true },
  { id: 'rev-2', author: 'Trần Thị Thu Hà', rating: 5, date: '10/10/2026', content: 'Dùng rất mượt, pin trâu và màn hình sắc nét đúng như mô tả. Đội ngũ TechShop hỗ trợ kỹ thuật nhiệt tình.', verified: true },
  { id: 'rev-3', author: 'Lê Hoàng Long', rating: 4, date: '04/10/2026', content: 'Thiết bị hoàn thiện cao cấp, giá săn sale rất tốt. Đi kèm bảo hành điện tử chính hãng tiện lợi.', verified: true },
];

export default function ProductDetailPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const shop = useShop();
  const { compact, notify, go } = useStoreUI();
  const { width } = useWindowDimensions();
  const desktop = width >= 860;

  const foundInState = shop.products.find(p => p.id === id);
  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);
  const product = fetchedProduct || foundInState || null;
  const [loading, setLoading] = useState(!foundInState);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [chosenColor, setChosenColor] = useState<string | null>(null);
  const selectedColor = chosenColor || product?.colors?.[0] || null;
  const [tab, setTab] = useState<'specs' | 'desc' | 'reviews'>('specs');
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getProduct(id, shop.categories)
      .then(p => {
        if (!cancelled) setFetchedProduct(p);
      })
      .catch(e => {
        if (!cancelled) setError(errorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, shop.categories]);

  if (!id || (!loading && !product)) {
    return (
      <View style={s.empty}>
        <Icon name="search" size={48} color="#94a3b8" />
        <Text style={s.sectionTitle}>Không tìm thấy sản phẩm</Text>
        <Text style={s.sectionSubtitle}>Sản phẩm có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</Text>
        <Button onPress={() => go('/shop')}>Xem danh mục sản phẩm</Button>
      </View>
    );
  }

  const p = product || foundInState;
  if (!p) return null;

  const isFavorite = shop.favorites.includes(p.id);
  const related = shop.products.filter(item => item.id !== p.id && item.category === p.category).slice(0, 3);

  const handleAddToCart = () => {
    let success = false;
    for (let i = 0; i < quantity; i++) {
      success = shop.add(p.id);
      if (!success) break;
    }
    notify(success ? `Đã thêm ${quantity} x ${p.name} vào giỏ hàng` : 'Số lượng đã đạt giới hạn tồn kho.');
  };

  const handleBuyNow = () => {
    shop.add(p.id);
    go('/checkout');
  };

  const handleAddReview = () => {
    if (!reviewerName.trim() || !reviewComment.trim()) {
      notify('Vui lòng nhập tên và nội dung đánh giá.');
      return;
    }
    setSubmittingReview(true);
    setTimeout(() => {
      const newRev: Review = {
        id: `rev-${Date.now()}`,
        author: reviewerName.trim(),
        rating: reviewRating,
        date: new Date().toLocaleDateString('vi-VN'),
        content: reviewComment.trim(),
        verified: true,
      };
      setReviews([newRev, ...reviews]);
      setReviewerName('');
      setReviewComment('');
      setSubmittingReview(false);
      notify('Cảm ơn bạn đã gửi đánh giá sản phẩm!');
    }, 400);
  };

  return (
    <View style={{ gap: 32 }}>
      {/* Breadcrumb */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Pressable onPress={() => go('/')}><Text style={s.footerLink}>Trang chủ</Text></Pressable>
        <Text style={{ color: '#94a3b8' }}>/</Text>
        <Pressable onPress={() => go(`/?category=${encodeURIComponent(p.category)}`)}>
          <Text style={s.footerLink}>{p.category}</Text>
        </Pressable>
        <Text style={{ color: '#94a3b8' }}>/</Text>
        <Text numberOfLines={1} style={{ color: '#0f172a', fontWeight: '600', maxWidth: 300 }}>{p.name}</Text>
      </View>

      {/* Main Product Info */}
      <View style={[s.panel, { padding: desktop ? 32 : 18 }]}>
        <View style={{ flexDirection: desktop ? 'row' : 'column', gap: desktop ? 40 : 24, alignItems: 'flex-start' }}>
          {/* Left Column: Image */}
          <View style={{ width: desktop ? '46%' : '100%', alignItems: 'center' }}>
            <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#f8fafc', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center' }}>
              <ProductImage uri={p.image} style={{ width: '100%', height: '100%' }} />
              {p.tag && (
                <View style={[s.productTag, { top: 12, left: 12, paddingVertical: 6, paddingHorizontal: 10 }]}>
                  <Text style={[s.productTagText, { fontSize: 11, fontWeight: '700' }]}>{p.tag}</Text>
                </View>
              )}
              <Pressable
                accessibilityLabel="Lưu yêu thích"
                onPress={() => shop.favorite(p.id)}
                style={[s.favoriteButton, { top: 12, right: 12, width: 36, height: 36, borderRadius: 20 }]}
              >
                {isFavorite ? <Text style={{ color: green, fontSize: 22 }}>♥</Text> : <Icon name="heart" size={19} color={green} />}
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16, width: '100%', justifyContent: 'center' }}>
              <Pressable onPress={() => go(`/compare?id=${p.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#f1f5f9', borderRadius: 7 }}>
                <Icon name="compare" size={15} color="#475569" />
                <Text style={{ fontSize: 12, color: '#475569', fontWeight: '600' }}>So sánh cấu hình</Text>
              </Pressable>
              <Pressable onPress={() => notify('Đã sao chép liên kết sản phẩm!')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#f1f5f9', borderRadius: 7 }}>
                <Icon name="share" size={15} color="#475569" />
                <Text style={{ fontSize: 12, color: '#475569', fontWeight: '600' }}>Chia sẻ</Text>
              </Pressable>
            </View>
          </View>

          {/* Right Column: Details */}
          <View style={{ width: desktop ? '50%' : '100%', gap: 18 }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View style={[s.statusPill, { paddingVertical: 4, paddingHorizontal: 10 }]}>
                  <Text style={{ color: green, fontSize: 11, fontWeight: '700' }}>{p.category.toUpperCase()}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="shield" size={14} color={green} />
                  <Text style={{ fontSize: 12, color: '#64748b' }}>Chính Hãng 100%</Text>
                </View>
              </View>
              <Text style={[s.sectionTitle, { fontSize: desktop ? 28 : 22, lineHeight: desktop ? 36 : 30 }]}>{p.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ color: '#eab308', fontSize: 15 }}>★★★★★</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>{p.rating ? p.rating.toFixed(1) : '4.9'}</Text>
                </View>
                <Text style={{ color: '#cbd5e1' }}>•</Text>
                <Text style={{ fontSize: 12, color: '#64748b' }}>{reviews.length} đánh giá khách hàng</Text>
                <Text style={{ color: '#cbd5e1' }}>•</Text>
                <Text style={{ fontSize: 12, color: p.stock > 0 ? green : '#dc2626', fontWeight: '600' }}>
                  {p.stock > 0 ? `Còn ${p.stock} sản phẩm` : 'Tạm hết hàng'}
                </Text>
              </View>
              {loading && <Text style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>Đang cập nhật dữ liệu mới nhất...</Text>}
              {!!error && <Text style={{ color: '#dc2626', fontSize: 11, marginTop: 4 }}>{error}</Text>}
            </View>

            {/* Price section */}
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 14, backgroundColor: '#f0fdfa', padding: 16, borderRadius: 10 }}>
              <Text style={[s.price, { fontSize: desktop ? 32 : 26 }]}>{money(p.price)}</Text>
              {p.oldPrice && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[s.oldPrice, { fontSize: 15 }]}>{money(p.oldPrice)}</Text>
                  <View style={{ backgroundColor: '#dc2626', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
                      -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Color Swatches */}
            {!!p.colors?.length && (
              <View style={{ gap: 8 }}>
                <Text style={s.fieldLabel}>Màu sắc: <Text style={{ fontWeight: '400', color: '#0f172a' }}>{selectedColor}</Text></Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {p.colors.map(color => {
                    const active = selectedColor === color;
                    return (
                      <Pressable
                        key={color}
                        onPress={() => setChosenColor(color)}
                        style={[
                          { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: active ? green : '#cbd5e1', backgroundColor: active ? '#f0fdfa' : '#fff' }
                        ]}
                      >
                        <Text style={{ fontSize: 12, color: active ? green : '#475569', fontWeight: active ? '700' : '500' }}>{color}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Quantity Selector */}
            <View style={{ gap: 8 }}>
              <Text style={s.fieldLabel}>Số lượng</Text>
              <View style={[s.quantity, { minHeight: 40 }]}>
                <Pressable
                  disabled={quantity <= 1}
                  onPress={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                >
                  <Text style={[s.quantityText, quantity <= 1 && { color: '#cbd5e1' }]}>−</Text>
                </Pressable>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#0f172a', minWidth: 24, textAlign: 'center' }}>{quantity}</Text>
                <Pressable
                  disabled={quantity >= p.stock}
                  onPress={() => setQuantity(q => Math.min(p.stock, q + 1))}
                  style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                >
                  <Text style={[s.quantityText, quantity >= p.stock && { color: '#cbd5e1' }]}>+</Text>
                </Pressable>
              </View>
            </View>

            {/* CTA Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
              <View style={{ flex: 1, minWidth: 160 }}>
                <Button disabled={!p.stock} onPress={handleAddToCart}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon name="bag" size={17} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Thêm vào giỏ</Text>
                  </View>
                </Button>
              </View>
              <View style={{ flex: 1, minWidth: 160 }}>
                <Pressable
                  disabled={!p.stock}
                  onPress={handleBuyNow}
                  style={({ pressed }) => [
                    s.button,
                    { backgroundColor: '#0f172a' },
                    pressed && { opacity: 0.8 },
                    !p.stock && { opacity: 0.4 }
                  ]}
                >
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Mua ngay</Text>
                </Pressable>
              </View>
            </View>

            {/* Value Guarantees */}
            <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 9, padding: 16, gap: 10, backgroundColor: '#f8fafc' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Icon name="truck" size={16} color={green} />
                <Text style={{ fontSize: 12, color: '#334155' }}>Miễn phí giao hàng toàn quốc đơn từ 500.000đ</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Icon name="box" size={16} color={green} />
                <Text style={{ fontSize: 12, color: '#334155' }}>Đổi trả miễn phí trong 30 ngày nếu có lỗi từ NSX</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Icon name="shield" size={16} color={green} />
                <Text style={{ fontSize: 12, color: '#334155' }}>Bảo hành 12 - 24 tháng chính hãng tại mọi trung tâm</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Details Tabs: Specs / Description / Reviews */}
      <View style={s.panel}>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', gap: 16, marginBottom: 20 }}>
          {[
            ['specs', 'Thông số kỹ thuật'],
            ['desc', 'Mô tả chi tiết'],
            ['reviews', `Đánh giá (${reviews.length})`],
          ].map(([key, label]) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setTab(key as typeof tab)}
                style={{ paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: active ? green : 'transparent' }}
              >
                <Text style={{ fontSize: 14, fontWeight: active ? '700' : '500', color: active ? green : '#64748b' }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'specs' && (
          <View style={{ gap: 12 }}>
            <View style={[s.summaryRow, { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }]}>
              <Text style={{ color: '#64748b', fontSize: 13, width: '40%' }}>Danh mục</Text>
              <Text style={{ color: '#0f172a', fontSize: 13, fontWeight: '600', width: '60%' }}>{p.category}</Text>
            </View>
            <View style={[s.summaryRow, { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }]}>
              <Text style={{ color: '#64748b', fontSize: 13, width: '40%' }}>Tình trạng kho</Text>
              <Text style={{ color: p.stock > 0 ? green : '#dc2626', fontSize: 13, fontWeight: '600', width: '60%' }}>
                {p.stock > 0 ? `Còn hàng (${p.stock} sản phẩm)` : 'Hết hàng'}
              </Text>
            </View>
            {(p.specs || [
              'Bảo hành chính hãng 12 tháng',
              'Hộp phụ kiện đầy đủ theo tiêu chuẩn',
              'Xuất xứ chính hãng phân phối tại Việt Nam',
              'Hỗ trợ kỹ thuật trọn đời máy tại TechShop'
            ]).map((spec, i) => (
              <View key={i} style={[s.summaryRow, { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }]}>
                <Text style={{ color: '#64748b', fontSize: 13, width: '40%' }}>Đặc điểm {i + 1}</Text>
                <Text style={{ color: '#0f172a', fontSize: 13, fontWeight: '600', width: '60%' }}>{spec}</Text>
              </View>
            ))}
          </View>
        )}

        {tab === 'desc' && (
          <View style={{ gap: 14 }}>
            <Text style={[s.sectionSubtitle, { fontSize: 14, lineHeight: 24, color: '#334155' }]}>
              {p.description || 'Sản phẩm công nghệ chính hãng được phân phối tại TechShop với chất lượng đảm bảo và chính sách bảo hành rõ ràng.'}
            </Text>
            <Text style={[s.sectionSubtitle, { fontSize: 14, lineHeight: 24, color: '#334155' }]}>
              Mọi sản phẩm bán ra tại TechShop đều trải qua quy trình kiểm tra nghiêm ngặt trước khi xuất kho, đi kèm tem chống hàng giả và hóa đơn điện tử VAT đầy đủ.
            </Text>
          </View>
        )}

        {tab === 'reviews' && (
          <View style={{ gap: 24 }}>
            {/* Review form */}
            <View style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 10, gap: 14, borderWidth: 1, borderColor: '#e2e8f0' }}>
              <Text style={[s.sectionTitle, { fontSize: 16 }]}>Gửi đánh giá của bạn</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={s.fieldLabel}>Đánh giá số sao:</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Pressable key={star} onPress={() => setReviewRating(star)}>
                      <Text style={{ fontSize: 20, color: star <= reviewRating ? '#eab308' : '#cbd5e1' }}>★</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <TextInput
                value={reviewerName}
                onChangeText={setReviewerName}
                placeholder="Họ và tên của bạn"
                placeholderTextColor="#94a3b8"
                style={s.field}
              />
              <TextInput
                value={reviewComment}
                onChangeText={setReviewComment}
                placeholder="Chia sẻ cảm nhận về hiệu năng, thiết kế hoặc trải nghiệm của bạn..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                style={[s.field, { minHeight: 70, textAlignVertical: 'top' }]}
              />
              <View style={{ alignSelf: 'flex-start' }}>
                <Button disabled={submittingReview} onPress={handleAddReview}>
                  {submittingReview ? 'Đang gửi...' : 'Gửi nhận xét'}
                </Button>
              </View>
            </View>

            {/* Review List */}
            <View style={{ gap: 16 }}>
              {reviews.map(rev => (
                <View key={rev.id} style={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 16, gap: 6 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontWeight: '700', color: '#0f172a', fontSize: 13 }}>{rev.author}</Text>
                      {rev.verified && (
                        <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                          <Text style={{ fontSize: 10, color: '#15803d', fontWeight: '600' }}>✓ Đã mua hàng</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontSize: 11, color: '#94a3b8' }}>{rev.date}</Text>
                  </View>
                  <Text style={{ color: '#eab308', fontSize: 13 }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</Text>
                  <Text style={{ color: '#475569', fontSize: 13, lineHeight: 20 }}>{rev.content}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Related Products */}
      {related.length > 0 && (
        <View style={{ gap: 16 }}>
          <View style={s.sectionHeading}>
            <View>
              <Text style={s.eyebrow}>GỢI Ý DÀNH CHO BẠN</Text>
              <Text style={s.sectionTitle}>Sản phẩm cùng danh mục</Text>
            </View>
            <Pressable onPress={() => go(`/?category=${encodeURIComponent(p.category)}`)}>
              <Text style={s.viewLink}>Xem tất cả {p.category} →</Text>
            </Pressable>
          </View>
          <ProductGrid
            products={related}
            compact={compact}
            columns={desktop ? 3 : 1}
            onSelect={prod => go(`/product?id=${prod.id}`)}
            onAdd={prod => notify(shop.add(prod.id) ? `Đã thêm ${prod.name} vào giỏ hàng` : 'Hết hàng')}
          />
        </View>
      )}
    </View>
  );
}
