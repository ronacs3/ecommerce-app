import { s } from '@/styles/store';
import { Pressable,Text,View } from 'react-native';

export function StoreFooter({ setInfo }: { setInfo: (value: string) => void }) {
  return <View style={s.footer}><Text style={s.footerText}>© 2026 form & field. Made for everyday living.</Text><View style={{ flexDirection: 'row', gap: 20 }}>{['Shipping & returns', 'Contact', 'Privacy'].map(label => <Pressable key={label} onPress={() => setInfo(label)}><Text style={s.footerText}>{label}</Text></Pressable>)}</View></View>;
}
