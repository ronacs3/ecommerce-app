import { Button } from '@/components/common/Button';
import { OrderList } from '@/components/orders/OrderList';
import { useAuth } from '@/hooks/useAuth';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import { Text, View } from 'react-native';

export default function AccountPage() {
  const auth = useAuth();
  const { go } = useStoreUI();
  if (!auth.ready) return <View style={s.empty}><Text>Đang kiểm tra phiên đăng nhập…</Text></View>;
  if (!auth.user) return <View style={s.empty}><Text style={s.sectionTitle}>Đăng nhập để xem đơn hàng</Text><Button onPress={() => go('/login?redirect=/account')}>Đăng nhập</Button></View>;
  return <><View style={s.pageHeading}><Text style={s.eyebrow}>TÀI KHOẢN TECHSHOP</Text><Text style={s.pageTitle}>Xin chào, {auth.user.name}</Text><Text style={s.sectionSubtitle}>{auth.user.email}</Text><View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginTop: 12 }}><Button secondary onPress={() => go('/wishlist')}>Sản phẩm yêu thích</Button>{auth.user.isAdmin && <Button onPress={() => go('/admin')}>Trang quản trị</Button>}<Button secondary onPress={() => { void auth.logout().then(() => go('/')); }}>Đăng xuất</Button></View></View><OrderList /></>;
}
