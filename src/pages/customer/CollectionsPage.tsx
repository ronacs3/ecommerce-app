import { categoryImages,heroImage } from '@/constants/catalog';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import { Image,Pressable,Text,View } from 'react-native';
export default function CollectionsPage() {
  const { compact, go } = useStoreUI();
  return <><View style={s.pageHeading}><Text style={s.eyebrow}>CURATED WITH INTENTION</Text><Text style={s.pageTitle}>A home that feels like you.</Text><Text style={s.sectionSubtitle}>Discover a new way to bring it all together.</Text></View><View style={[s.categories, { gap: 24 }]}>{[['The slow living edit', 'Furniture', heroImage], ['Quiet little corners', 'Lighting', categoryImages[2]], ['Texture & warmth', 'Textiles', categoryImages[3]]].map(([title, category, image]) => <Pressable key={title} onPress={() => go(`/shop?category=${category}`)} style={{ width: compact ? '100%' : '31%', gap: 16 }}><Image source={{ uri: image }} style={{ width: '100%', height: 340, borderRadius: 9 }} /><Text style={s.sectionTitle}>{title} ↗</Text><Text style={s.sectionSubtitle}>Thoughtfully selected {category.toLowerCase()} for your everyday.</Text></Pressable>)}</View></>;
}
