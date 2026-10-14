import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { ProductGrid } from '@/components/products/ProductGrid';
import { categories,green } from '@/constants/catalog';
import { useCatalog } from '@/hooks/useCatalog';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import type { Product } from '@/types/shop';
import { useLocalSearchParams,usePathname } from 'expo-router';
import { Pressable,ScrollView,Text,View } from 'react-native';


export default function CatalogPage() {
  const { compact, go, setSelected, add, search, sort, setSort } = useStoreUI();
  const section = usePathname().split('/')[1] || 'home';
  const params = useLocalSearchParams<{ category?: string; filter?: string }>();
  const products = useCatalog({ category: params.category, filter: params.filter, search, sort, wishlist: section === 'wishlist' });
  const grid = (items: Product[]) => <ProductGrid products={items} compact={compact} onSelect={setSelected} onAdd={add} />;
  return <><View style={s.pageHeading}><Text style={s.eyebrow}>CONSIDERED PIECES FOR EVERYDAY LIVING</Text><Text style={s.pageTitle}>{search ? `Results for “${search}”` : section === 'wishlist' ? 'Your saved favorites' : params.category || 'A little something for your home.'}</Text><Text style={s.sectionSubtitle}>Discover timeless design, natural materials, and thoughtful details.</Text></View><View style={[s.catalogToolbar, compact && { flexDirection: 'column', alignItems: 'stretch' }]}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>{['All', ...categories].map(c => <Pressable key={c} onPress={() => go(c === 'All' ? '/shop' : `/shop?category=${c}`)} style={[s.filter, ((c === 'All' && !params.category) || c === params.category) && s.filterActive]}><Text style={{ color: ((c === 'All' && !params.category) || c === params.category) ? '#fff' : green, fontSize: 12 }}>{c}</Text></Pressable>)}</ScrollView><Pressable style={s.filter} onPress={() => setSort(sort === 'Featured' ? 'Price: low to high' : sort === 'Price: low to high' ? 'Price: high to low' : 'Featured')}><Text style={{ color: green, fontSize: 12 }}>Sort: {sort} ⌄</Text></Pressable></View><Text style={[s.sectionSubtitle, { marginBottom: 22 }]}>{products.length} thoughtfully chosen pieces</Text>{grid(products)}{!products.length && <View style={s.empty}><Icon name="heart" size={40} color={green} /><Text style={s.sectionTitle}>A little room for something lovely.</Text><Text style={s.sectionSubtitle}>Try another search or save your favorite pieces.</Text><Button onPress={() => go('/shop')}>Explore the shop →</Button></View>}</>;
}
