import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { useShop } from '@/hooks/useShop';
import { s } from '@/styles/store';
import type { Product } from '@/types/shop';
import { Image,Modal,Pressable,ScrollView,Text,View } from 'react-native';

export function ProductDetailModal({ selected, setSelected, compact, add }: { selected: Product | null; setSelected: (product: Product | null) => void; compact: boolean; add: (product: Product) => void }) {
  const shop = useShop();
  return <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}><View style={s.modalOverlay}><Pressable style={s.absoluteFill} onPress={() => setSelected(null)} /><View style={s.productModal}><Pressable accessibilityLabel="Close product" style={s.modalClose} onPress={() => setSelected(null)}><Icon name="close" /></Pressable>{selected && <ScrollView><Image source={{ uri: selected.image }} style={{ width: '100%', height: compact ? 240 : 310, borderRadius: 8 }} /><View style={{ gap: 15, paddingTop: 22 }}><Text style={s.eyebrow}>{selected.category}</Text><Text style={s.sectionTitle}>{selected.name}</Text><Text style={s.price}>${selected.price.toFixed(2)}</Text><Text style={[s.sectionSubtitle, { lineHeight: 24 }]}>A considered addition to your home. Beautifully finished, thoughtfully crafted, and designed to feel at home in your everyday.</Text><View style={s.swatches}>{selected.colors.map(c => <View key={c} style={[s.swatch, { backgroundColor: c, width: 20, height: 20 }]} />)}<Text style={s.sectionSubtitle}>Available finishes</Text></View><Text style={s.sectionSubtitle}>{shop.products.find(p => p.id === selected.id)?.stock || 0} pieces available · 30-day returns</Text><Button disabled={!(shop.products.find(p => p.id === selected.id)?.stock)} onPress={() => add(selected)}>Add to your bag  +</Button><Button secondary onPress={() => shop.favorite(selected.id)}>{shop.favorites.includes(selected.id) ? 'Saved to your wishlist ♥' : 'Save to your wishlist ♡'}</Button></View></ScrollView>}</View></View></Modal>;
}
