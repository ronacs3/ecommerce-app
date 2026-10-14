import { heroImage } from '@/constants/catalog';
import { s } from '@/styles/store';
import { Image,Text,View } from 'react-native';

export default function AboutPage() {
  return <><View style={s.pageHeading}><Text style={s.eyebrow}>OUR PHILOSOPHY</Text><Text style={s.pageTitle}>A little less, a little better.</Text><Text style={[s.sectionSubtitle, { maxWidth: 620, lineHeight: 27 }]}>We believe a beautiful home begins with intention. Natural materials, timeless shapes, and things you love to live with. We curate each piece for everyday comfort and enduring design.</Text></View><Image source={{ uri: heroImage }} style={{ width: '100%', height: 380, borderRadius: 12 }} /></>;
}
