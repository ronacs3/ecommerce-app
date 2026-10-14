import { Icon } from '@/components/common/Icon';
import { categories,green } from '@/constants/catalog';
import { useShop } from '@/hooks/useShop';
import { s } from '@/styles/store';
import { Pressable,ScrollView,Text,View } from 'react-native';

export function StoreSidebar({ section, go }: { section: string; go: (route: string) => void }) {
  const shop = useShop();
  const nav = [['home', 'Discover', '/'], ['shop', 'Shop all', '/shop'], ['collections', 'Collections', '/collections'], ['heart', 'Wishlist', '/wishlist']];
  return <ScrollView style={{ width: 242, flexGrow: 0, backgroundColor: '#f6f7f0' }} contentContainerStyle={[s.sidebar, { height: undefined, flexGrow: 1 }]} showsVerticalScrollIndicator={false}>
    <Pressable onPress={() => go('/')}><Text style={s.logo}>form<Text style={{ color: '#859079' }}> & </Text>field.</Text><Text style={s.logoSubtitle}>THOUGHTFULLY CURATED LIVING</Text></Pressable>
    <Text style={s.navLabel}>YOUR EVERYDAY, ELEVATED</Text>
    <View style={{ gap: 7 }}>{nav.map(([icon, label, route]) => { const active = (section === 'home' && route === '/') || section === route.slice(1); return <Pressable key={label} onPress={() => go(route)} style={({ pressed }) => [s.navItem, active && s.activeNav, pressed && { backgroundColor: '#edf0e8' }]}><Icon name={icon} size={21} color={green} /><Text style={[s.navText, active && { color: green, fontWeight: '600' }]}>{label}</Text>{label === 'Wishlist' && shop.favorites.length > 0 && <Text style={s.navCount}>{shop.favorites.length}</Text>}</Pressable>; })}</View>
    <View style={s.sideDivider} /><Text style={[s.navLabel, { marginTop: 27 }]}>SHOP BY CATEGORY</Text>
    {categories.map(c => <Pressable key={c} onPress={() => go(`/shop?category=${c}`)} style={s.categoryNav}><Text style={s.categoryNavText}>{c}</Text><Icon name="arrow" size={13} color="#9a9e94" /></Pressable>)}
    <View style={{ flex: 1, minHeight: 40 }} />
    <View style={s.sidePromo}><Icon name="leaf" color={green} size={27} /><Text style={s.sidePromoTitle}>A little less,{String.fromCharCode(10)}a little better.</Text><Text style={s.sidePromoText}>Made with care. Chosen to last.{String.fromCharCode(10)}Good for your home and our planet.</Text><Pressable onPress={() => go('/about')}><Text style={s.underlink}>Our philosophy  ↗</Text></Pressable></View>
    <Pressable style={s.adminNav} onPress={() => go('/admin')}><Icon name="admin" size={18} /><Text style={s.categoryNavText}>Admin dashboard</Text><Icon name="arrow" size={14} /></Pressable>
    <View style={s.sideDivider} /><Pressable style={s.profile} onPress={() => go('/account')}><View style={s.avatar}><Text style={{ color: green, fontWeight: '600', fontSize: 11 }}>JD</Text></View><View style={{ flex: 1 }}><Text style={{ fontSize: 12, color: '#4e5844', fontWeight: '600' }}>Jamie Davis</Text><Text style={{ fontSize: 10, color: '#8b8f83', marginTop: 4 }}>Welcome home</Text></View><Text style={{ color: '#8b8f83' }}>⌄</Text></Pressable>
  </ScrollView>;
}
