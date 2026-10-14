import { Icon } from '@/components/common/Icon';
import { green } from '@/constants/catalog';
import { useShop } from '@/hooks/useShop';
import { s } from '@/styles/store';
import type { Product } from '@/types/shop';
import { money } from '@/utils/money';
import { Image,Pressable,Text,View } from 'react-native';

export function ProductGrid({ products, compact, onSelect, onAdd }: { products: Product[]; compact: boolean; onSelect: (p: Product) => void; onAdd: (p: Product) => void }) {
  const shop = useShop();
  return <View style={s.productGrid}>{products.map(p => <View key={p.id} style={[s.productCard, { width: compact ? '48%' : '23.5%' }]}>
    <Pressable onPress={() => onSelect(p)} style={({ pressed }) => [s.productImageWrap, compact && { height: 190 }, pressed && { opacity: 0.9 }]}><Image source={{ uri: p.image }} style={s.productImage} resizeMode="cover" />{p.tag && <View style={[s.productTag, p.tag === 'New' && { backgroundColor: '#edf0e5' }]}><Text style={s.productTagText}>{p.tag}</Text></View>}</Pressable>
    <Pressable accessibilityLabel={`Save ${p.name}`} onPress={() => shop.favorite(p.id)} style={s.favoriteButton}>{shop.favorites.includes(p.id) ? <Text style={{ color: green, fontSize: 19 }}>♥</Text> : <Icon name="heart" size={15} color={green} />}</Pressable>
    <View style={{ paddingTop: 14, gap: 7 }}><Text style={s.productCategory}>{p.category}</Text><Pressable onPress={() => onSelect(p)}><Text numberOfLines={1} style={s.productName}>{p.name}</Text></Pressable><View style={s.productBottom}><Text style={s.price}>{money(p.price)} <Text style={s.oldPrice}>{p.oldPrice ? money(p.oldPrice) : ''}</Text></Text><Pressable accessibilityLabel={`Add ${p.name} to bag`} onPress={() => onAdd(p)} style={s.addSmall}><Text style={{ fontSize: 18, color: green }}>+</Text></Pressable></View><View style={s.swatches}>{p.colors.map(c => <View key={c} style={[s.swatch, { backgroundColor: c }]} />)}<Text style={{ fontSize: 9, color: '#9c9e96' }}>+{p.colors.length} colors</Text></View></View>
  </View>)}</View>;
}
