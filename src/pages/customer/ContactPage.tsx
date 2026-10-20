import { useState } from 'react';
import { Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { green } from '@/constants/catalog';
import { useAuth } from '@/hooks/useAuth';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';

const topics = [
  'Tư vấn chọn mua thiết bị',
  'Hỗ trợ kỹ thuật & Cài đặt',
  'Bảo hành & Đổi trả sản phẩm',
  'Kiểm tra tiến độ đơn hàng',
  'Khiếu nại & Góp ý dịch vụ',
];

export default function ContactPage() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const auth = useAuth();
  const { notify, go } = useStoreUI();
  const { width } = useWindowDimensions();
  const desktop = width >= 860;

  const [name, setName] = useState(auth.user?.name || '');
  const [email, setEmail] = useState(auth.user?.email || '');
  const [phone, setPhone] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(orderId ? 'Kiểm tra tiến độ đơn hàng' : topics[0]);
  const [code, setCode] = useState(orderId || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      notify('Vui lòng điền họ tên, email và nội dung yêu cầu.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const randomTicket = `TK-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(randomTicket);
      notify('Yêu cầu hỗ trợ đã được gửi thành công!');
    }, 500);
  };

  const handleReset = () => {
    setMessage('');
    setTicketId(null);
  };

  return (
    <View style={{ gap: 32 }}>
      {/* Page Heading */}
      <View style={s.pageHeading}>
        <Text style={s.eyebrow}>TRUNG TÂM CHĂM SÓC KHÁCH HÀNG</Text>
        <Text style={s.pageTitle}>Liên hệ & Hỗ trợ kỹ thuật</Text>
        <Text style={[s.sectionSubtitle, { maxWidth: 800 }]}>
          Đội ngũ chuyên viên TechShop luôn sẵn sàng giải đáp thắc mắc, tư vấn giải pháp công nghệ và hỗ trợ kỹ thuật tận tâm 24/7.
        </Text>
      </View>

      {/* 3 Contact Cards */}
      <View style={{ flexDirection: desktop ? 'row' : 'column', gap: 18 }}>
        <View style={[s.panel, { flex: 1, padding: 22, gap: 12 }]}>
          <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#f0fdfa', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="phone-call" size={22} color={green} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a' }}>Tổng đài Hotline 24/7</Text>
          <Text style={{ fontSize: 20, fontWeight: '900', color: green }}>1900 6789</Text>
          <Text style={{ fontSize: 12, color: '#64748b', lineHeight: 18 }}>
            Miễn phí cuộc gọi. Tư vấn mua hàng, hỗ trợ đặt đơn và giải đáp kỹ thuật nhanh chóng.
          </Text>
        </View>

        <View style={[s.panel, { flex: 1, padding: 22, gap: 12 }]}>
          <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#f0fdfa', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="mail" size={22} color={green} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a' }}>Hộp thư điện tử CSKH</Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>cskh@techshop.com</Text>
          <Text style={{ fontSize: 12, color: '#64748b', lineHeight: 18 }}>
            Phản hồi nhanh trong vòng 2 giờ làm việc đối với mọi yêu cầu bảo hành hoặc khiếu nại.
          </Text>
        </View>

        <View style={[s.panel, { flex: 1, padding: 22, gap: 12 }]}>
          <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#f0fdfa', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="location" size={22} color={green} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a' }}>Hệ thống Showroom</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>Hà Nội • TP.HCM • Đà Nẵng</Text>
          <Text style={{ fontSize: 12, color: '#64748b', lineHeight: 18 }}>
            Mở cửa: 08:00 - 21:30 (kể cả Thứ 7 và Chủ Nhật). Trải nghiệm trực tiếp các thiết bị công nghệ mới nhất.
          </Text>
        </View>
      </View>

      {/* Main Form and Showrooms */}
      <View style={{ flexDirection: desktop ? 'row' : 'column', gap: 28, alignItems: 'flex-start' }}>
        {/* Support Request Form */}
        <View style={[s.panel, { flex: 1.3, padding: desktop ? 30 : 20, width: '100%', gap: 18 }]}>
          <Text style={[s.sectionTitle, { fontSize: 20 }]}>Gửi yêu cầu trực tuyến</Text>
          <Text style={{ fontSize: 13, color: '#64748b' }}>
            Vui lòng để lại thông tin, chuyên viên TechShop sẽ liên hệ hỗ trợ bạn qua điện thoại hoặc email.
          </Text>

          {ticketId ? (
            <View style={{ backgroundColor: '#f0fdfa', borderWidth: 1, borderColor: '#ccfbf1', borderRadius: 10, padding: 24, gap: 14, alignItems: 'center' }}>
              <View style={[s.successIcon, { width: 56, height: 56, borderRadius: 28 }]}>
                <Icon name="check" size={28} color={green} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', textAlign: 'center' }}>
                Đã tiếp nhận yêu cầu hỗ trợ!
              </Text>
              <Text style={{ fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 22 }}>
                Mã tiếp nhận: <Text style={{ fontWeight: '800', color: green }}>{ticketId}</Text>
                {String.fromCharCode(10)}Chúng tôi đã gửi email xác nhận đến <Text style={{ fontWeight: '600' }}>{email}</Text>. Chuyên viên hỗ trợ sẽ liên hệ lại bạn sớm nhất.
              </Text>
              <Button secondary onPress={handleReset}>Gửi thêm yêu cầu khác</Button>
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: desktop ? 'row' : 'column', gap: 14 }}>
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={s.fieldLabel}>Họ và tên *</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Nguyễn Văn A"
                    placeholderTextColor="#94a3b8"
                    style={s.field}
                  />
                </View>
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={s.fieldLabel}>Số điện thoại</Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="0912 345 678"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    style={s.field}
                  />
                </View>
              </View>

              <View style={{ gap: 6 }}>
                <Text style={s.fieldLabel}>Email nhận phản hồi *</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@example.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={s.field}
                />
              </View>

              <View style={{ gap: 6 }}>
                <Text style={s.fieldLabel}>Chủ đề yêu cầu</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {topics.map(t => {
                    const active = selectedTopic === t;
                    return (
                      <Pressable
                        key={t}
                        onPress={() => setSelectedTopic(t)}
                        style={[s.filter, active && s.filterActive, { paddingVertical: 7, paddingHorizontal: 12 }]}
                      >
                        <Text style={{ fontSize: 12, color: active ? '#fff' : '#334155', fontWeight: active ? '700' : '500' }}>
                          {t}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={{ gap: 6 }}>
                <Text style={s.fieldLabel}>Mã đơn hàng (không bắt buộc)</Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="Ví dụ: ORD-89201"
                  placeholderTextColor="#94a3b8"
                  style={s.field}
                />
              </View>

              <View style={{ gap: 6 }}>
                <Text style={s.fieldLabel}>Nội dung chi tiết *</Text>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Mô tả cụ thể sự cố thiết bị, câu hỏi tư vấn hoặc vấn đề cần xử lý..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                  style={[s.field, { minHeight: 90, textAlignVertical: 'top' }]}
                />
              </View>

              <View style={{ marginTop: 4 }}>
                <Button disabled={loading} onPress={handleSubmit}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon name="send" size={16} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
                      {loading ? 'Đang gửi thông tin...' : 'Gửi yêu cầu hỗ trợ'}
                    </Text>
                  </View>
                </Button>
              </View>
            </View>
          )}
        </View>

        {/* Showrooms and FAQ Quick Access */}
        <View style={{ flex: 1, gap: 20, width: '100%' }}>
          <View style={[s.panel, { padding: 22, gap: 14 }]}>
            <Text style={[s.sectionTitle, { fontSize: 18 }]}>Địa chỉ Showroom TechShop</Text>
            <View style={{ gap: 14 }}>
              <View style={{ gap: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>📍 TechShop Cầu Giấy (Hà Nội)</Text>
                <Text style={{ fontSize: 12, color: '#64748b' }}>123 Đường Cầu Giấy, P. Dịch Vọng, Q. Cầu Giấy</Text>
                <Text style={{ fontSize: 11, color: green }}>Có bãi đỗ ô tô • Trung tâm trải nghiệm laptop & gear</Text>
              </View>
              <View style={{ gap: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>📍 TechShop Quận 1 (TP. Hồ Chí Minh)</Text>
                <Text style={{ fontSize: 12, color: '#64748b' }}>456 Đường Lê Lợi, Phường Bến Nghé, Quận 1</Text>
                <Text style={{ fontSize: 11, color: green }}>Trung tâm bảo hành Apple & Android chính hãng</Text>
              </View>
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>📍 TechShop Hải Châu (Đà Nẵng)</Text>
                <Text style={{ fontSize: 12, color: '#64748b' }}>78 Đường Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu</Text>
                <Text style={{ fontSize: 11, color: green }}>Giao hàng hỏa tốc trong 2 giờ nội thành</Text>
              </View>
            </View>
          </View>

          <View style={[s.panel, { padding: 22, gap: 12, backgroundColor: '#0f172a', borderColor: '#1e293b' }]}>
            <Text style={{ color: '#2dd4bf', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>CÂU HỎI THƯỜNG GẶP</Text>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Bạn cần câu trả lời ngay?</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 20 }}>
              Xem hướng dẫn bảo hành 1 đổi 1, chính sách đổi trả trong 30 ngày và các bước thanh toán trả góp.
            </Text>
            <Pressable
              onPress={() => go('/faq')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}
            >
              <Text style={{ color: '#2dd4bf', fontSize: 13, fontWeight: '700' }}>Xem Trung tâm Trợ giúp / FAQ</Text>
              <Icon name="right" size={15} color="#2dd4bf" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
