import { Icon } from '@/components/common/Icon';
import { InfoModal } from '@/components/common/InfoModal';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreSidebar } from '@/components/layout/StoreSidebar';
import { ProductDetailModal } from '@/components/products/ProductDetailModal';
import { green } from '@/constants/catalog';
import { StoreUIContext } from '@/contexts/StoreUIContext';
import { useShop } from '@/hooks/useShop';
import CatalogPage from '@/pages/customer/CatalogPage';
import { s } from '@/styles/store';
import type { Product } from '@/types/shop';
import { router,usePathname,type Href } from 'expo-router';
import { useState,type ReactNode } from 'react';
import { Modal,Pressable,ScrollView,Text,TextInput,useWindowDimensions,View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function StoreLayout({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 1050;
  const compact = width < 650;
  const section = usePathname().split('/')[1] || 'home';
  const shop = useShop();
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [toast, setToast] = useState('');
  const [sort, setSort] = useState('Featured');
  const [info, setInfo] = useState('');
  const count = Object.values(shop.cart).reduce((a, b) => a + b, 0);
  const notify = (message: string) => { setToast(message); setTimeout(() => setToast(''), 3500); };
  const go = (route: string) => { setMenuOpen(false); setSearch(''); router.push(route as Href); };
  const add = (p: Product) => notify(shop.add(p.id) ? `${p.name} added to your bag` : 'This item has reached its available stock.');

  const sidebar = <StoreSidebar section={section} go={go} />;
  return <StoreUIContext.Provider value={{ compact, go, notify, setSelected, add, search, sort, setSort }}>
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
    {desktop && sidebar}<View style={{ flex: 1, minWidth: 0 }}>
      <View style={s.announcement}><Text style={s.announcementText}>A fresh start for your space. <Text style={{ fontWeight: '600' }}>Enjoy 10% off your first order with WELCOME10</Text>  ↗</Text></View>
      <StoreHeader desktop={desktop} compact={compact} section={section} count={count} go={go} setMenuOpen={setMenuOpen} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
      {searchOpen && <View style={s.searchBar}><Icon name="search" /><TextInput autoFocus style={{ flex: 1, fontSize: 15, padding: 12, color: green }} placeholder="Search for something beautiful…" value={search} onChangeText={setSearch} /><Pressable onPress={() => { setSearch(''); setSearchOpen(false); }}><Icon name="close" /></Pressable></View>}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.main, { paddingHorizontal: compact ? 20 : 36 }]} showsVerticalScrollIndicator={false}>
        {search ? <CatalogPage /> : children}
        <StoreFooter setInfo={setInfo} />
      </ScrollView></View>
    <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}><View style={s.modalOverlay}><Pressable style={s.absoluteFill} onPress={() => setMenuOpen(false)} /><View style={{ alignSelf: 'flex-start', height: '100%', width: 242 }}>{sidebar}</View></View></Modal>
    <ProductDetailModal selected={selected} setSelected={setSelected} compact={compact} add={add} />
    <InfoModal info={info} setInfo={setInfo} />
    {!!toast && <View style={s.toast}><Icon name="check" color="#fff" size={18} /><Text style={{ color: '#fff', fontSize: 13, flexShrink: 1 }}>{toast}</Text></View>}
  </SafeAreaView>
  </StoreUIContext.Provider>;
}
