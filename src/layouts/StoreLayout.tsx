import { Icon } from '@/components/common/Icon';
import { Button } from '@/components/common/Button';
import { InfoModal } from '@/components/common/InfoModal';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreSidebar } from '@/components/layout/StoreSidebar';
import { ProductDetailModal } from '@/components/products/ProductDetailModal';
import { StoreUIContext } from '@/contexts/StoreUIContext';
import { useShop } from '@/hooks/useShop';
import CatalogPage from '@/pages/customer/CatalogPage';
import { s } from '@/styles/store';
import type { Product } from '@/types/shop';
import { router, type Href } from 'expo-router';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function StoreLayout({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const compact = width < 650;
  const shop = useShop();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [toast, setToast] = useState('');
  const [sort, setSort] = useState('Featured');
  const [info, setInfo] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroll = useRef<ScrollView>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const count = Object.values(shop.cart).reduce((a, b) => a + b, 0);
  const notify = (message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(''), 3500);
  };
  const go = (route: string) => {
    setMenuOpen(false);
    setSearch('');
    router.push(route as Href);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const add = (p: Product) => notify(shop.add(p.id) ? `Đã thêm ${p.name} vào giỏ hàng` : 'Số lượng đã đạt giới hạn tồn kho.');

  return <StoreUIContext.Provider value={{ compact, go, notify, setSelected, add, search, setSearch, sort, setSort }}>
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={s.announcement}>
        <View style={[s.contentWidth, s.announcementInner]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 }}>
            <View style={s.hotBadge}><Text style={s.hotText}>HOT</Text></View>
            <Text numberOfLines={1} style={[s.announcementText, compact && { fontSize: 10 }]}>Thiết bị công nghệ chính hãng — khám phá ưu đãi mỗi ngày</Text>
          </View>
          {!compact && <View style={{ flexDirection: 'row', gap: 16 }}>
            <Pressable onPress={() => go('/promotions')}><Text style={[s.announcementText, { color: '#2dd4bf', fontWeight: '700' }]}>⚡ Khuyến mãi</Text></Pressable>
            <Text style={s.announcementText}>|</Text>
            <Pressable onPress={() => go('/compare')}><Text style={s.announcementText}>So sánh</Text></Pressable>
            <Text style={s.announcementText}>|</Text>
            <Pressable onPress={() => go('/tracking')}><Text style={s.announcementText}>Tra cứu đơn hàng</Text></Pressable>
            <Text style={s.announcementText}>|</Text>
            <Pressable onPress={() => go('/contact')}><Text style={s.announcementText}>Liên hệ</Text></Pressable>
          </View>}
        </View>
      </View>
      <StoreHeader count={count} go={go} search={search} setSearch={setSearch} openMenu={() => setMenuOpen(true)} />
      <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={[s.main, { paddingHorizontal: compact ? 16 : 24 }]}>
          {!!shop.error && <View style={[s.panel, { marginBottom: 20 }]}><Text style={{ color: '#dc2626', fontSize: 13 }}>{shop.error}</Text><Button disabled={shop.loading} onPress={() => { void shop.refresh().catch(() => {}); }}>Thử kết nối lại</Button></View>}
          {search ? <CatalogPage /> : children}
        </View>
        <StoreFooter setInfo={setInfo} />
      </ScrollView>
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <View style={s.modalOverlay}>
          <Pressable style={s.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={{ height: '100%', alignSelf: 'flex-end', width: 280 }}>
            <StoreSidebar go={go} close={() => setMenuOpen(false)} />
          </View>
        </View>
      </Modal>
      <ProductDetailModal selected={selected} setSelected={setSelected} compact={compact} add={add} />
      <InfoModal info={info} setInfo={setInfo} />
      {!!toast && <View accessibilityLiveRegion="polite" style={s.toast}><Icon name="check" size={18} color="#fff" /><Text style={{ color: '#fff', fontSize: 13, flexShrink: 1 }}>{toast}</Text></View>}
    </SafeAreaView>
  </StoreUIContext.Provider>;
}
