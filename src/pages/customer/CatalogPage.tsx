import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { green } from '@/constants/catalog';
import { useCategories } from '@/hooks/useCategories';
import { useShop } from '@/hooks/useShop';
import { useCatalog } from '@/hooks/useCatalog';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import { useLocalSearchParams, usePathname } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

export default function CatalogPage() {
  const categories = useCategories();
  const shop = useShop();
  const { go, setSelected, add, search, sort, setSort } = useStoreUI();
  const { width } = useWindowDimensions();
  const mobile = width < 1000;
  const [showFilters, setShowFilters] = useState(false);
  const section = usePathname().split('/')[1] || 'home';
  const params = useLocalSearchParams<{ category?: string; filter?: string; keyword?: string; min?: string; max?: string }>();
  const wishlist = section === 'wishlist';
  const keyword = search || params.keyword || '';
  const products = useCatalog({ category: params.category, filter: params.filter, search: keyword, sort, wishlist, min: params.min, max: params.max });
  const sortLabels: Record<string, string> = { Featured: 'Nổi bật', 'Price: low to high': 'Giá tăng dần', 'Price: high to low': 'Giá giảm dần' };
  return <>
    {wishlist && <View style={s.pageHeading}><Text style={s.eyebrow}>BỘ SƯU TẬP CỦA BẠN</Text><Text style={s.pageTitle}>Sản phẩm yêu thích</Text><Text style={s.sectionSubtitle}>Lưu lại những thiết bị bạn đang quan tâm.</Text></View>}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categoryTabs}>
      {['Tất cả', ...categories].map((c, i) => {
        const active = i === 0 ? !params.category : c === params.category;
        return <Pressable key={c} onPress={() => go(i === 0 ? '/' : `/?category=${encodeURIComponent(c)}`)} style={[s.categoryTab, active && s.categoryTabActive]}><Icon name={i === 0 ? 'shop' : 'tag'} size={16} color={active ? '#fff' : '#64748b'} /><Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : '#475569' }}>{c}</Text></Pressable>;
      })}
    </ScrollView>
    {mobile && <Pressable style={[s.filter, { alignSelf: 'flex-start', marginTop: 19, flexDirection: 'row', gap: 9 }]} onPress={() => setShowFilters(!showFilters)}><Icon name="filter" size={15} color={green} /><Text style={{ fontSize: 12, color: green }}>{showFilters ? 'Ẩn bộ lọc' : 'Bộ lọc sản phẩm'}</Text></Pressable>}
    <View style={[s.catalogLayout, mobile && { flexDirection: 'column', alignItems: 'stretch' }]}>
      {(!mobile || showFilters) && <ProductFilters key={`${params.category}-${keyword}-${params.min}-${params.max}`} category={params.category} keyword={keyword} min={params.min} max={params.max} mobile={mobile} />}
      <View style={s.catalogContent}>
        <View style={s.catalogHeading}>
          <View><Text style={s.eyebrow}>✦ TechShop lựa chọn</Text><Text style={[s.sectionTitle, { marginTop: 8 }]}>{keyword ? `Kết quả cho “${keyword}”` : params.category || (wishlist ? 'Đã lưu yêu thích' : 'Tất cả sản phẩm')}</Text><Text style={s.sectionSubtitle}>{products.length} sản phẩm công nghệ chính hãng</Text></View>
          <Pressable onPress={() => setSort(sort === 'Featured' ? 'Price: low to high' : sort === 'Price: low to high' ? 'Price: high to low' : 'Featured')} style={s.filter}><Text style={{ fontSize: 11, color: '#64748b' }}>{sortLabels[sort]}  ⌄</Text></Pressable>
        </View>
        {shop.loading && <View style={[s.panel, { marginBottom: 20 }]}><Text style={s.sectionSubtitle}>Đang tải sản phẩm từ cửa hàng…</Text></View>}
        <ProductGrid products={products} compact={width < 650} columns={width >= 1100 ? 3 : width >= 650 ? 2 : 1} onSelect={setSelected} onAdd={add} />
        {!shop.loading && !shop.error && !products.length && <View style={s.empty}><Icon name={wishlist ? 'heart' : 'search'} size={43} color="#94a3b8" /><Text style={[s.sectionTitle, { fontSize: 20, textAlign: 'center' }]}>{wishlist ? 'Chưa có sản phẩm yêu thích' : 'Chưa tìm thấy sản phẩm phù hợp'}</Text><Text style={[s.sectionSubtitle, { textAlign: 'center' }]}>Thử đổi từ khóa hoặc điều chỉnh bộ lọc để xem thêm sản phẩm.</Text><Button onPress={() => go('/')}>Xem tất cả sản phẩm</Button></View>}
      </View>
    </View>
  </>;
}
