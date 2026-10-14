import { green } from '@/constants/catalog';
import { useShop } from '@/hooks/useShop';
import { s } from '@/styles/store';
import { money } from '@/utils/money';
import { Pressable,Text,View } from 'react-native';

export function OrderList({ admin = false }: { admin?: boolean }) {
  const shop = useShop();
  return <View style={s.panel}><Text style={s.sectionTitle}>{admin ? 'Recent orders' : 'Your orders'}</Text>{!shop.orders.length && <Text style={[s.sectionSubtitle, { paddingVertical: 30 }]}>No orders yet. Your first thoughtful find is just around the corner.</Text>}{shop.orders.map(o => <View key={o.id} style={s.orderRow}><View style={{ flex: 1, gap: 7 }}><Text style={s.productName}>{o.id}</Text><Text style={s.sectionSubtitle}>{o.name} · {new Date(o.date).toLocaleDateString()}</Text><Text style={s.sectionSubtitle}>{o.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}</Text>{admin && <Text style={s.sectionSubtitle}>{o.email} · {o.address}</Text>}</View><View style={{ alignItems: 'flex-end', gap: 12 }}><Text style={s.price}>{money(o.total)}</Text><Pressable disabled={!admin} onPress={() => shop.updateOrder(o.id, o.status === 'Processing' ? 'Shipped' : o.status === 'Shipped' ? 'Delivered' : 'Processing')} style={s.statusPill}><Text style={{ fontSize: 11, color: green }}>{o.status}{admin ? ' ⌄' : ''}</Text></Pressable></View></View>)}</View>;
}
