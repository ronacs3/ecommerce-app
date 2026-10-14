import { Icon } from '@/components/common/Icon';
import { green } from '@/constants/catalog';
import { useCategories } from '@/hooks/useCategories';
import { s } from '@/styles/store';
import { Pressable, ScrollView, Text, View } from 'react-native';

export function StoreSidebar({ go, close }: { go: (route: string) => void; close: () => void }) {
  const categories = useCategories();
  return <ScrollView contentContainerStyle={s.sidebar}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}><Text style={s.logo}>Tech<Text style={{ color: green }}>Shop</Text></Text><Pressable accessibilityLabel="Đóng menu" onPress={close}><Icon name="close" /></Pressable></View>
    {[['home', 'Trang chủ', '/'], ['heart', 'Sản phẩm yêu thích', '/wishlist'], ['book', 'Tin tức công nghệ', '/blog'], ['user', 'Tài khoản & đơn hàng', '/account']].map(([icon, title, route]) => <Pressable key={title} onPress={() => go(route)} style={s.navItem}><Icon name={icon} size={19} /><Text style={s.navText}>{title}</Text></Pressable>)}
    <Text style={s.navLabel}>DANH MỤC SẢN PHẨM</Text>
    {categories.map(c => <Pressable key={c} onPress={() => go(`/?category=${encodeURIComponent(c)}`)} style={s.navItem}><Icon name="tag" size={19} color={green} /><Text style={s.navText}>{c}</Text></Pressable>)}
    <Pressable onPress={() => go('/admin')} style={[s.navItem, { marginTop: 15, borderTopWidth: 1, borderTopColor: '#e2e8f0' }]}><Icon name="admin" size={19} /><Text style={s.navText}>Trang quản trị</Text></Pressable>
  </ScrollView>;
}
