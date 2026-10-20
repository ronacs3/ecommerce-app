import { useState } from 'react';
import { Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { green } from '@/constants/catalog';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';

type FAQItem = {
  id: string;
  category: string;
  q: string;
  a: string;
};

const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Bảo hành chính hãng',
    q: 'Chính sách bảo hành tại TechShop có gì đặc biệt?',
    a: '100% thiết bị tại TechShop là hàng chính hãng phân phối tại Việt Nam, kích hoạt bảo hành điện tử chính thức từ 12 đến 24 tháng theo tiêu chuẩn nhà sản xuất. Đặc biệt, khách hàng được hỗ trợ tiếp nhận bảo hành tận nhà miễn phí trong 12 tháng đầu.',
  },
  {
    id: 'faq-2',
    category: 'Đổi trả trong 30 ngày',
    q: 'Quy định đổi trả hàng trong 30 ngày đầu tiên như thế nào?',
    a: 'Trong vòng 30 ngày kể từ ngày nhận hàng, nếu thiết bị phát sinh lỗi kỹ thuật từ nhà sản xuất (phần cứng, màn hình, nguồn sạc...), TechShop sẽ áp dụng chính sách 1 đổi 1 sang máy mới nguyên seal ngay lập tức hoặc hoàn tiền 100% nếu hết hàng thay thế.',
  },
  {
    id: 'faq-3',
    category: 'Giao hàng & Vận chuyển',
    q: 'Phí giao hàng và thời gian nhận hàng mất bao lâu?',
    a: 'Mọi đơn hàng có giá trị từ 500.000đ trở lên đều được MIỄN PHÍ giao hàng tiêu chuẩn toàn quốc. Thời gian giao hàng nội thành Hà Nội & TP. Hồ Chí Minh là 24h - 48h. Các tỉnh thành khác dao động từ 2 - 4 ngày làm việc.',
  },
  {
    id: 'faq-4',
    category: 'Giao hàng & Vận chuyển',
    q: 'Tôi có được mở hộp kiểm tra hàng trước khi thanh toán không?',
    a: 'Có. TechShop khuyến khích khách hàng đồng kiểm ngoại quan sản phẩm (kiểm tra hộp máy, tem niêm phong, phụ kiện đi kèm và tính nguyên vẹn bên ngoài) cùng nhân viên giao hàng trước khi ký nhận và thanh toán.',
  },
  {
    id: 'faq-5',
    category: 'Thanh toán & Trả góp',
    q: 'TechShop chấp nhận những phương thức thanh toán nào?',
    a: 'Chúng tôi hỗ trợ đa dạng phương thức: Thanh toán tiền mặt khi nhận hàng (COD), Chuyển khoản ngân hàng trực tiếp, Quét mã VietQR nhanh, Thẻ ATM nội địa và Thẻ quốc tế Visa/MasterCard. Ngoài ra, chúng tôi hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng.',
  },
  {
    id: 'faq-6',
    category: 'Tài khoản & Đơn hàng',
    q: 'Làm thế nào để theo dõi vị trí và tiến trình đơn hàng?',
    a: 'Bạn có thể truy cập trang "Tra cứu đơn hàng" (/tracking) trên thanh menu, sau đó nhập mã đơn hàng hoặc địa chỉ email để xem chi tiết lộ trình vận chuyển từ lúc xuất kho đến khi giao tận tay.',
  },
  {
    id: 'faq-7',
    category: 'Tài khoản & Đơn hàng',
    q: 'Tôi có thể hủy đơn hàng sau khi đã đặt thành công không?',
    a: 'Nếu đơn hàng đang ở trạng thái "Đang xử lý" hoặc "TechShop xác nhận", bạn có thể tự bấm hủy trong mục Tài khoản hoặc gọi ngay tới Hotline 1900 6789. Khi đơn đã bàn giao cho bên vận chuyển, bạn vui lòng từ chối nhận hàng khi shipper gọi giao.',
  },
];

const categories = [
  'Tất cả',
  'Bảo hành chính hãng',
  'Đổi trả trong 30 ngày',
  'Giao hàng & Vận chuyển',
  'Thanh toán & Trả góp',
  'Tài khoản & Đơn hàng',
];

export default function FaqPage() {
  const { notify, go } = useStoreUI();
  const { width } = useWindowDimensions();
  const desktop = width >= 860;

  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const filtered = faqData.filter(item => {
    const matchCat = activeCategory === 'Tất cả' || item.category === activeCategory;
    const matchSearch = !search.trim() || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={{ gap: 32 }}>
      {/* Page Heading */}
      <View style={s.pageHeading}>
        <Text style={s.eyebrow}>TRUNG TÂM TRỢ GIÚP & CHÍNH SÁCH</Text>
        <Text style={s.pageTitle}>Câu hỏi thường gặp (FAQ)</Text>
        <Text style={[s.sectionSubtitle, { maxWidth: 800 }]}>
          Tìm nhanh câu trả lời về chính sách bảo hành, đổi trả, quy trình giao nhận và các hình thức thanh toán tại TechShop.
        </Text>
      </View>

      {/* Search Input */}
      <View style={[s.panel, { padding: 20, backgroundColor: '#f8fafc' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="search" size={20} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm kiếm vấn đề bạn thắc mắc (ví dụ: đổi trả, bảo hành, phí ship, trả góp)..."
            placeholderTextColor="#94a3b8"
            style={[s.field, { flex: 1, backgroundColor: '#fff' }]}
          />
          {!!search && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <Icon name="close" size={18} color="#64748b" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category Filter Pills */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {categories.map(cat => {
          const active = activeCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                s.filter,
                active && s.filterActive,
                { paddingVertical: 8, paddingHorizontal: 14 }
              ]}
            >
              <Text style={{ fontSize: 12, color: active ? '#fff' : '#334155', fontWeight: active ? '700' : '500' }}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Accordion FAQ Items */}
      <View style={[s.panel, { padding: desktop ? 24 : 16, gap: 12 }]}>
        {filtered.length > 0 ? (
          filtered.map(item => {
            const isExpanded = expandedId === item.id;
            return (
              <View
                key={item.id}
                style={{
                  borderWidth: 1,
                  borderColor: isExpanded ? green : '#e2e8f0',
                  borderRadius: 10,
                  overflow: 'hidden',
                  backgroundColor: isExpanded ? '#f0fdfa20' : '#fff',
                }}
              >
                <Pressable
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    gap: 12,
                  }}
                >
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ fontSize: 11, color: green, fontWeight: '700' }}>{item.category}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a', lineHeight: 22 }}>
                      {item.q}
                    </Text>
                  </View>
                  <View style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}>
                    <Icon name="down-arrow" size={18} color={isExpanded ? green : '#64748b'} />
                  </View>
                </Pressable>
                {isExpanded && (
                  <View style={{ paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 }}>
                    <Text style={{ fontSize: 13, color: '#334155', lineHeight: 22 }}>{item.a}</Text>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={s.empty}>
            <Icon name="help" size={40} color="#94a3b8" />
            <Text style={s.sectionTitle}>Không tìm thấy câu hỏi phù hợp</Text>
            <Text style={s.sectionSubtitle}>Bạn có thể gửi câu hỏi trực tiếp cho bộ phận hỗ trợ khách hàng của chúng tôi.</Text>
            <Button onPress={() => go('/contact')}>Gửi câu hỏi tới CSKH</Button>
          </View>
        )}
      </View>

      {/* 4-Step Warranty Process Guide */}
      <View style={[s.panel, { padding: desktop ? 28 : 20, gap: 18 }]}>
        <Text style={[s.sectionTitle, { fontSize: 20 }]}>Quy trình 4 bước gửi bảo hành đơn giản</Text>
        <View style={{ flexDirection: desktop ? 'row' : 'column', gap: 16 }}>
          {[
            ['1', 'Liên hệ tiếp nhận', 'Gọi hotline 1900 6789 hoặc điền form tại trang Liên hệ.'],
            ['2', 'Kiểm tra lỗi từ xa', 'Kỹ thuật viên tư vấn xác định tình trạng lỗi phần mềm/cứng.'],
            ['3', 'Lấy máy tận nhà', 'Shipper đến nhận thiết bị tại địa chỉ của bạn hoàn toàn miễn phí.'],
            ['4', 'Đổi mới / Trả máy', 'Đổi mới 1-1 trong 30 ngày hoặc sửa chữa hoàn tất gửi lại bạn.'],
          ].map(([stepNum, stepTitle, stepDesc]) => (
            <View key={stepNum} style={{ flex: 1, backgroundColor: '#f8fafc', padding: 16, borderRadius: 9, borderWidth: 1, borderColor: '#e2e8f0', gap: 8 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: green, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>{stepNum}</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>{stepTitle}</Text>
              <Text style={{ fontSize: 12, color: '#64748b', lineHeight: 18 }}>{stepDesc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Still need help CTA banner */}
      <View style={[s.panel, { backgroundColor: '#0f172a', borderColor: '#1e293b', padding: 24, flexDirection: desktop ? 'row' : 'column', justifyContent: 'space-between', alignItems: desktop ? 'center' : 'flex-start', gap: 18 }]}>
        <View style={{ gap: 6, flex: 1 }}>
          <Text style={{ color: '#2dd4bf', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>HỖ TRỢ TRỰC TIẾP</Text>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>Bạn vẫn chưa tìm thấy câu trả lời?</Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 20 }}>
            Chuyên viên tư vấn của TechShop luôn sẵn sàng hỗ trợ bạn qua điện thoại hoặc trò chuyện trực tuyến.
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button onPress={() => go('/contact')}>Gửi tin nhắn hỗ trợ</Button>
          <Pressable
            onPress={() => notify('Hotline 1900 6789 - Hoạt động 24/7 (Miễn phí)')}
            style={{ paddingHorizontal: 18, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155', backgroundColor: '#ffffff10' }}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Gọi 1900 6789</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
