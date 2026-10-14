import { Icon } from '@/components/common/Icon';
import { heroImage } from '@/constants/catalog';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';

export function TechHero() {
  const { go } = useStoreUI();
  const { width } = useWindowDimensions();
  const mobile = width < 900;
  return <View style={s.hero}>
    <Image source={{ uri: heroImage }} style={[s.absoluteFill, s.heroImage]} resizeMode="cover" />
    <View style={[s.absoluteFill, s.heroShade]} /><View style={s.heroGlow} />
    <View style={[s.heroInner, mobile && { flexDirection: 'column', alignItems: 'stretch', padding: width < 650 ? 25 : 35, gap: 25 }]}>
      <View style={[s.heroContent, mobile && { flex: 0 }]}>
        <View style={s.heroBadge}><Icon name="zap" size={15} color="#fcd34d" /><Text style={{ fontSize: 11, fontWeight: '600', color: '#99f6e4' }}>Công nghệ thế hệ mới 2026</Text></View>
        <Text style={[s.heroTitle, width < 650 && { fontSize: 32, lineHeight: 42, letterSpacing: -1 }]}>Chọn đúng thiết bị,{String.fromCharCode(10)}<Text style={{ color: '#5eead4' }}>tận hưởng trọn trải nghiệm.</Text></Text>
        <Text style={s.heroDescription}>Khám phá laptop, điện thoại và phụ kiện chính hãng với ưu đãi đặc quyền. Nâng cấp công nghệ, mở rộng trải nghiệm mỗi ngày.</Text>
        <View style={s.heroButtons}>
          <Pressable onPress={() => go('/?category=Laptop')} style={({ pressed }) => [s.heroPrimary, pressed && { opacity: 0.8 }]}><Text style={{ color: '#042f2e', fontSize: 13, fontWeight: '800' }}>Khám phá sản phẩm</Text><Icon name="right" size={17} color="#042f2e" /></Pressable>
          <Pressable onPress={() => go(`/?category=${encodeURIComponent('Phụ kiện')}`)} style={s.heroSecondary}><Icon name="gift" size={17} color="#fcd34d" /><Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Xem phụ kiện hot</Text></Pressable>
        </View>
      </View>
      <View style={[s.heroServices, mobile && { flex: 0 }, mobile && width >= 650 && { flexDirection: 'row' }]}>
        {[['truck', 'Giao hàng 2H', 'Nội thành Hà Nội & TP.HCM'], ['shield', '100% Chính hãng', 'Bảo hành rõ ràng, minh bạch'], ['box', 'Đổi mới 30 ngày', 'Hỗ trợ nhanh chóng khi có lỗi']].map(([icon, title, subtitle]) => <View key={title} style={[s.heroService, mobile && width >= 650 && { flex: 1, flexDirection: 'column', alignItems: 'flex-start' }]}><View style={s.heroServiceIcon}><Icon name={icon} size={23} color="#5eead4" /></View><View><Text style={s.heroServiceTitle}>{title}</Text><Text style={s.heroServiceSubtitle}>{subtitle}</Text></View></View>)}
      </View>
    </View>
  </View>;
}
