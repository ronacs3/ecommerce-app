import { useState } from 'react';
import { Image, Text, View, type ImageStyle, type StyleProp } from 'react-native';
import { Icon } from '@/components/common/Icon';

function ImageContent({ uri, style }: { uri: string; style: StyleProp<ImageStyle> }) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) return <View style={[style, { backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', gap: 8 }]}><Icon name="monitor" color="#94a3b8" size={28} /><Text style={{ color: '#94a3b8', fontSize: 10 }}>Chưa có ảnh</Text></View>;
  return <Image source={{ uri }} style={style} resizeMode="cover" onError={() => setFailed(true)} />;
}
export function ProductImage(props: { uri: string; style: StyleProp<ImageStyle> }) { return <ImageContent key={props.uri} {...props} />; }
