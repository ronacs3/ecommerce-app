import { categoryImages } from '@/constants/catalog';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import { Image, Pressable, Text, View } from 'react-native';

export default function CollectionsPage() {
  const { compact, go } = useStoreUI();
  return <><View style={s.pageHeading}><Text style={s.eyebrow}>LỰA CHỌN THEO NHU CẦU</Text><Text style={s.pageTitle}>Thiết bị phù hợp với bạn.</Text><Text style={s.sectionSubtitle}>Từ góc làm việc hiệu quả đến những phút giây giải trí.</Text></View><View style={s.categories}>{[['Làm việc & học tập', 'Laptop', categoryImages[0]], ['Kết nối mỗi ngày', 'Điện thoại', categoryImages[1]], ['Âm thanh đỉnh cao', 'Tai nghe', categoryImages[3]]].map(([title, category, image]) => <Pressable key={title} onPress={() => go(`/?category=${encodeURIComponent(category)}`)} style={{ width: compact ? '100%' : '31%', gap: 15 }}><Image source={{ uri: image }} style={{ width: '100%', height: 260, borderRadius: 12 }} /><Text style={[s.sectionTitle, { fontSize: 20 }]}>{title} ↗</Text><Text style={s.sectionSubtitle}>Khám phá {category.toLowerCase()} chính hãng.</Text></Pressable>)}</View></>;
}
