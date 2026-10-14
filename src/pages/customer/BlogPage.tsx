import { Icon } from '@/components/common/Icon';
import { categoryImages, green } from '@/constants/catalog';
import { s } from '@/styles/store';
import { useState } from 'react';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';

const articles = [
  { title: 'Chọn laptop phù hợp cho học tập và công việc', category: 'TƯ VẤN MUA SẮM', image: categoryImages[0], excerpt: 'Cân bằng hiệu năng, thời lượng pin và tính di động trong từng nhu cầu.', body: 'Hãy bắt đầu từ các ứng dụng bạn dùng mỗi ngày. Với nhu cầu văn phòng và học tập, ưu tiên bộ nhớ đủ rộng, bàn phím thoải mái và thời lượng pin. Nếu thường xuyên dựng video hoặc thiết kế, hãy tìm hiểu thêm về CPU, GPU và khả năng tản nhiệt. Kiểm tra cổng kết nối, trọng lượng và điều kiện bảo hành trước khi quyết định.' },
  { title: 'Những điều cần lưu ý khi nâng cấp điện thoại', category: 'KINH NGHIỆM', image: categoryImages[1], excerpt: 'Camera, màn hình, pin và dung lượng: yếu tố nào quan trọng với bạn?', body: 'Xác định hạn chế của thiết bị đang dùng trước khi nâng cấp. Nếu lưu nhiều ảnh và video, hãy ưu tiên dung lượng. Nếu thường xuyên đi lại, pin và tốc độ sạc có thể quan trọng hơn các thông số khác. So sánh hệ điều hành, kích thước màn hình và khả năng đồng bộ với các thiết bị hiện có.' },
  { title: 'Tai nghe chống ồn cho một ngày tập trung', category: 'GÓC CÔNG NGHỆ', image: categoryImages[3], excerpt: 'Tìm hiểu sự khác biệt giữa cách âm thụ động và chống ồn chủ động.', body: 'Cách âm thụ động phụ thuộc vào thiết kế và độ ôm của tai nghe. Chống ồn chủ động dùng micro và xử lý tín hiệu để giảm một số tiếng ồn nền. Trải nghiệm thực tế khác nhau theo môi trường, vì vậy nên thử độ thoải mái, chất lượng cuộc gọi và chế độ xuyên âm trước khi lựa chọn.' },
];
export default function BlogPage() {
  const { width } = useWindowDimensions();
  const [expanded, setExpanded] = useState<number | null>(null);
  return <><View style={s.pageHeading}><Text style={s.eyebrow}>TECHSHOP JOURNAL</Text><Text style={s.pageTitle}>Tin tức & góc công nghệ</Text><Text style={s.sectionSubtitle}>Kinh nghiệm chọn thiết bị và gợi ý cho cuộc sống số của bạn.</Text></View><View style={s.categories}>{articles.map((a, i) => <View key={a.title} style={[s.panel, { width: width < 800 ? '100%' : '31%', padding: 18 }]}><Image source={{ uri: a.image }} style={{ width: '100%', height: 210, borderRadius: 9 }} /><Text style={[s.eyebrow, { fontSize: 10 }]}>{a.category}</Text><Text style={[s.sectionTitle, { fontSize: 19, lineHeight: 28 }]}>{a.title}</Text><Text style={s.sectionSubtitle}>{expanded === i ? a.body : a.excerpt}</Text><Pressable onPress={() => setExpanded(expanded === i ? null : i)} style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}><Text style={s.viewLink}>{expanded === i ? 'Thu gọn' : 'Đọc thêm'}</Text><Icon name="right" size={15} color={green} /></Pressable></View>)}</View></>;
}
