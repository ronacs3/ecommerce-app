import { Button } from '@/components/common/Button';
import { heroImage } from '@/constants/catalog';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import { Image, Text, View } from 'react-native';

export default function AboutPage() {
  const { go } = useStoreUI();
  return <><View style={s.pageHeading}><Text style={s.eyebrow}>VỀ TECHSHOP</Text><Text style={s.pageTitle}>Công nghệ cho cuộc sống tốt hơn.</Text><Text style={[s.sectionSubtitle, { maxWidth: 780 }]}>TechShop đồng hành cùng bạn trong từng lựa chọn công nghệ. Khám phá thiết bị phù hợp cho học tập, công việc và giải trí, cùng trải nghiệm mua sắm thuận tiện, rõ ràng.</Text></View><Image source={{ uri: heroImage }} style={{ height: 360, width: '100%', borderRadius: 16 }} /><View style={{ marginTop: 25, alignItems: 'flex-start' }}><Button onPress={() => go('/')}>Khám phá sản phẩm →</Button></View></>;
}
