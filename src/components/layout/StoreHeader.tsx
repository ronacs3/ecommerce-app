import { Icon } from '@/components/common/Icon';
import { green } from '@/constants/catalog';
import { s } from '@/styles/store';
import { useAuth } from '@/hooks/useAuth';
import { Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';

type Props = { count: number; go: (route: string) => void; search: string; setSearch: (value: string) => void; openMenu: () => void };

export function StoreHeader({ count, go, search, setSearch, openMenu }: Props) {
  const auth = useAuth();
  const { width } = useWindowDimensions();
  const mobile = width < 800;
  const searchField = <View style={s.headerSearch}>
    <Icon name="search" size={19} color="#94a3b8" />
    <TextInput accessibilityLabel="Tìm kiếm sản phẩm" value={search} onChangeText={setSearch} placeholder="Tìm laptop, điện thoại, phụ kiện..." placeholderTextColor="#94a3b8" style={s.headerSearchInput} />
    {!!search && <Pressable accessibilityLabel="Xóa tìm kiếm" hitSlop={8} onPress={() => setSearch('')}><Icon name="close" size={16} /></Pressable>}
  </View>;
  return <View style={s.header}>
    <View style={[s.contentWidth, s.topbar, mobile && { gap: 14, minHeight: 73 }]}>
      <Pressable onPress={() => go('/')} style={s.brand}>
        <View style={[s.brandIcon, width < 450 && { width: 35, height: 35 }]}><Icon name="zap" size={24} color="#fff" /></View>
        <View><Text style={[s.logo, width < 450 && { fontSize: 23 }]}>Tech<Text style={{ color: green }}>Shop</Text></Text><Text style={s.logoSubtitle}>PREMIUM TECH</Text></View>
      </Pressable>
      {!mobile && <View style={{ flex: 1, flexDirection: 'row', gap: 16, maxWidth: 630 }}>{searchField}<Pressable style={s.newsButton} onPress={() => go('/blog')}><Icon name="book" size={16} color="#115e59" /><Text style={s.topLink}>Tin tức</Text></Pressable></View>}
      <View style={[s.headerActions, mobile && { gap: 12 }]}>
        <Pressable accessibilityLabel="Giỏ hàng" onPress={() => go('/cart')} style={s.bagButton}>
          <View style={s.cartIcon}><Icon name="bag" size={21} /><View style={s.cartBadge}><Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>{count}</Text></View></View>
          {width > 1100 && <View><Text style={{ fontSize: 11, color: '#94a3b8' }}>Giỏ hàng</Text><Text style={{ fontSize: 12, color: '#1e293b', marginTop: 5, fontWeight: '700' }}>{count} sản phẩm</Text></View>}
        </Pressable>
        <Pressable accessibilityLabel={auth.user ? 'Tài khoản' : 'Đăng nhập'} onPress={() => go(auth.user ? '/account' : '/login')} style={[s.loginButton, width < 450 && { paddingHorizontal: 11 }]}><Icon name="user" color="#fff" size={17} />{width >= 450 && <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{auth.user ? 'Tài khoản' : 'Đăng nhập'}</Text>}</Pressable>
        {mobile && <Pressable accessibilityLabel="Mở menu" onPress={openMenu} style={s.mobileMenuButton}><Icon name="menu" size={20} /></Pressable>}
      </View>
    </View>
    {mobile && <View style={[s.contentWidth, { paddingBottom: 14 }]}>{searchField}</View>}
  </View>;
}
