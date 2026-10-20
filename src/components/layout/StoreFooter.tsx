import { Icon } from '@/components/common/Icon';
import { green } from '@/constants/catalog';
import { useCategories } from '@/hooks/useCategories';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';

export function StoreFooter({ setInfo }: { setInfo: (value: string) => void }) {
  const categories = useCategories();
  const { go } = useStoreUI();
  const { width } = useWindowDimensions();
  const compact = width < 650;
  return <>
    <View style={s.benefits}><View style={[s.contentWidth, s.benefitsInner]}>
      {[['truck', 'Giao Hàng Miễn Phí', 'Cho tất cả đơn hàng từ 500K'], ['shield', '100% Chính Hãng', 'Bảo hành rõ ràng, an tâm mua sắm'], ['box', 'Đổi Trả Dễ Dàng', 'Hỗ trợ trong 30 ngày đầu'], ['support', 'Hỗ Trợ 24/7', 'Tư vấn nhanh chóng, tận tâm']].map(([icon, title, subtitle]) => <View key={title} style={[s.benefit, { width: compact ? '48%' : '23%' }]}><View style={s.benefitIcon}><Icon name={icon} color={green} size={22} /></View><View style={{ flexShrink: 1 }}><Text style={[s.benefitTitle, compact && { fontSize: 11 }]}>{title}</Text><Text style={[s.benefitSubtitle, compact && { fontSize: 9, lineHeight: 15 }]}>{subtitle}</Text></View></View>)}
    </View></View>
    <View style={s.footer}><View style={s.contentWidth}>
      <View style={s.footerColumns}>
        <View style={{ width: compact ? '100%' : '29%', gap: 15 }}><Pressable style={s.brand} onPress={() => go('/')}><View style={[s.brandIcon, { backgroundColor: '#1e293b' }]}><Text style={{ color: '#2dd4bf', fontSize: 22, fontWeight: '900' }}>T</Text></View><Text style={[s.logo, { color: '#fff' }]}>Tech<Text style={{ color: '#2dd4bf' }}>Shop</Text></Text></Pressable><Text style={s.footerText}>Thiết bị công nghệ chính hãng, giá tốt và dịch vụ tận tâm. Cùng bạn tìm lựa chọn phù hợp cho học tập, làm việc và giải trí.</Text><Pressable onPress={() => go('/about')}><Text style={{ color: '#2dd4bf', fontSize: 12 }}>Tìm hiểu về TechShop →</Text></Pressable></View>
        <View style={{ width: compact ? '45%' : '18%' }}><Text style={s.footerHeading}>Sản Phẩm</Text>{categories.map(c => <Pressable key={c} onPress={() => go(`/?category=${encodeURIComponent(c)}`)}><Text style={s.footerLink}>{c}</Text></Pressable>)}</View>
        <View style={{ width: compact ? '45%' : '21%' }}>
          <Text style={s.footerHeading}>Hỗ Trợ Khách Hàng</Text>
          <Pressable onPress={() => go('/faq')}><Text style={s.footerLink}>Câu hỏi thường gặp & CS</Text></Pressable>
          <Pressable onPress={() => go('/tracking')}><Text style={s.footerLink}>Tra cứu đơn hàng</Text></Pressable>
          <Pressable onPress={() => go('/promotions')}><Text style={s.footerLink}>Khuyến mãi & Voucher</Text></Pressable>
          <Pressable onPress={() => go('/compare')}><Text style={s.footerLink}>So sánh thiết bị</Text></Pressable>
          <Pressable onPress={() => go('/contact')}><Text style={s.footerLink}>Liên hệ & Góp ý</Text></Pressable>
          <Pressable onPress={() => go('/admin')}><Text style={s.footerLink}>Trang quản trị</Text></Pressable>
        </View>
        <View style={{ width: compact ? '100%' : '23%', gap: 10 }}>
          <Text style={s.footerHeading}>Liên Hệ</Text>
          <Pressable onPress={() => go('/contact')} style={{ flexDirection: 'row', gap: 10 }}>
            <Icon name="location" size={16} color="#94a3b8" />
            <Text style={[s.footerText, { flex: 1 }]}>123 Đường Cầu Giấy, Hà Nội</Text>
          </Pressable>
          <Pressable onPress={() => go('/contact')}><Text style={s.footerText}>Hotline: 1900 6789 (24/7)</Text></Pressable>
          <Pressable onPress={() => go('/contact')}><Text style={s.footerText}>cskh@techshop.com</Text></Pressable>
          <Pressable onPress={() => go('/contact')}><Text style={{ color: '#2dd4bf', fontSize: 11 }}>Gửi tin nhắn trực tiếp →</Text></Pressable>
        </View>
      </View>
      <View style={s.footerBottom}><Text style={s.footerText}>© 2026 TechShop. Tất cả quyền được bảo lưu.</Text><View style={{ flexDirection: 'row', gap: 24 }}><Pressable onPress={() => setInfo('Quyền riêng tư')}><Text style={s.footerText}>Quyền riêng tư</Text></Pressable><Pressable onPress={() => go('/shop')}><Text style={s.footerText}>Tất cả sản phẩm</Text></Pressable></View></View>
    </View></View>
  </>;
}
