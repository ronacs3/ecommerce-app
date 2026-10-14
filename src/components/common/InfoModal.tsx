import { s } from '@/styles/store';
import { Modal,Text,View } from 'react-native';
import { Button } from './Button';

export function InfoModal({ info, setInfo }: { info: string; setInfo: (value: string) => void }) {
  return <Modal visible={!!info} transparent animationType="fade" onRequestClose={() => setInfo('')}><View style={s.modalOverlay}><View style={s.productModal}><Text style={s.sectionTitle}>{info}</Text><Text style={[s.sectionSubtitle, { lineHeight: 26, marginVertical: 20 }]}>{info === 'Shipping & returns' ? 'Free shipping on orders over $150. Standard shipping is $12. Orders typically arrive in 3–7 business days. Return unused pieces within 30 days for a refund.' : info === 'Contact' ? 'Reach the team at hello@formandfield.example. This storefront is a demo.' : 'This demo stores your shopping preferences and orders in this browser. No payment information is collected or sent to a payment provider.'}</Text><Button onPress={() => setInfo('')}>Got it</Button></View></View></Modal>;
}
