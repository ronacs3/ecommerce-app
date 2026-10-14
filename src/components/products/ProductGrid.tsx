import { Icon } from '@/components/common/Icon';
import { green } from '@/constants/catalog';
import { useShop } from '@/hooks/useShop';
import { s } from '@/styles/store';
import type { Product } from '@/types/shop';
import { money } from '@/utils/money';
import { Pressable, Text, View } from 'react-native';
import { ProductImage } from './ProductImage';

type Props = { products: Product[]; compact: boolean; columns?: number; onSelect: (p: Product) => void; onAdd: (p: Product) => void };

export function ProductGrid({ products, compact, columns = compact ? 1 : 3, onSelect, onAdd }: Props) {
  const shop = useShop();
  return <View style={s.productGrid}>{products.map(p => <View key={p.id} style={[s.productCard, { width: columns === 1 ? '100%' : columns === 2 ? '48%' : '31.5%' }]}>
    <Pressable accessibilityLabel={`Xem ${p.name}`} onPress={() => onSelect(p)} style={({ pressed }) => [s.productImageWrap, pressed && { opacity: 0.85 }]}>
      <ProductImage uri={p.image} style={s.productImage} />
      {p.tag && <View style={s.productTag}><Text style={s.productTagText}>{p.tag}</Text></View>}
    </Pressable>
    <Pressable accessibilityLabel={`Yêu thích ${p.name}`} hitSlop={7} onPress={() => shop.favorite(p.id)} style={s.favoriteButton}>{shop.favorites.includes(p.id) ? <Text style={{ color: green, fontSize: 20 }}>♥</Text> : <Icon name="heart" size={16} color={green} />}</Pressable>
    <View style={{ gap: 8, paddingTop: 16 }}>
      <Text style={s.productCategory}>{p.category}</Text>
      <Pressable onPress={() => onSelect(p)}><Text numberOfLines={2} style={[s.productName, { minHeight: 44 }]}>{p.name}</Text></Pressable>
      <View style={{ minHeight: 38 }}>{(p.specs || ['Sản phẩm chính hãng', 'Bảo hành theo nhà sản xuất']).map(spec => <Text key={spec} numberOfLines={1} style={s.productSpec}>{spec}</Text>)}</View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><Icon name="shield" size={12} color={green} /><Text style={{ fontSize: 11, color: '#64748b' }}>Chính hãng</Text><Text style={{ color: '#cbd5e1', fontSize: 11 }}>·</Text><Text style={{ fontSize: 10, color: p.stock ? green : '#ef4444' }}>{p.stock ? 'Còn hàng' : 'Hết hàng'}</Text></View>
      <View style={s.productBottom}>
        <View style={{ gap: 5 }}><Text style={s.price}>{money(p.price)}</Text>{p.oldPrice && <Text style={s.oldPrice}>{money(p.oldPrice)}</Text>}</View>
        <Pressable accessibilityLabel={`Thêm ${p.name} vào giỏ hàng`} disabled={!p.stock} onPress={() => onAdd(p)} style={({ pressed }) => [s.addSmall, (!p.stock || pressed) && { opacity: 0.5 }]}><Icon name="bag" size={14} color="#fff" /><Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Thêm</Text></Pressable>
      </View>
    </View>
  </View>)}</View>;
}
