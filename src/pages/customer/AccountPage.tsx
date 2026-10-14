import { Button } from '@/components/common/Button';
import { OrderList } from '@/components/orders/OrderList';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import { Text,View } from 'react-native';

export default function AccountPage() {
  const { go } = useStoreUI();
  return <><View style={s.pageHeading}><Text style={s.eyebrow}>YOUR LITTLE CORNER</Text><Text style={s.pageTitle}>Welcome home.</Text><Text style={s.sectionSubtitle}>Your purchases and favorite finds, all in one place.</Text></View><OrderList /><View style={{ marginTop: 22 }}><Button onPress={() => go('/wishlist')}>View your wishlist →</Button></View></>;
}
