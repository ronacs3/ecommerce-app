import { s } from '@/styles/store';
import { Modal, Text, View } from 'react-native';
import { Button } from './Button';

const content: Record<string, string> = {
  'Chính sách bảo hành': 'Bảo hành theo thời hạn của từng nhà sản xuất. Vui lòng giữ hóa đơn và cung cấp mã đơn hàng khi cần hỗ trợ. Đây là thông tin chính sách mẫu của bản demo.',
  'Chính sách đổi trả': 'Hỗ trợ kiểm tra và đổi trả sản phẩm trong 30 ngày theo tình trạng sản phẩm và điều kiện bảo hành. Miễn phí giao hàng cho đơn từ 500.000đ; phí tiêu chuẩn 30.000đ. Đây là chính sách mẫu.',
  'Hướng dẫn mua hàng': 'Tìm sản phẩm, xem chi tiết và thêm vào giỏ hàng. Bạn có thể điều chỉnh số lượng và xác nhận mã ưu đãi. Đăng nhập, nhập địa chỉ nhận hàng rồi bấm Đặt hàng để tạo đơn trên hệ thống. Thanh toán khi nhận hàng (COD).',
  'Quyền riêng tư': 'Giỏ hàng và yêu thích được lưu trên trình duyệt. Tài khoản và đơn hàng được xử lý bởi hệ thống API. JWT được giữ trong phiên trình duyệt hoặc SecureStore trên điện thoại. Mật khẩu không được lưu bởi frontend.',
};
export function InfoModal({ info, setInfo }: { info: string; setInfo: (value: string) => void }) {
  return <Modal visible={!!info} transparent animationType="fade" onRequestClose={() => setInfo('')}><View style={s.modalOverlay}><View style={s.productModal}><Text style={s.sectionTitle}>{info}</Text><Text style={[s.sectionSubtitle, { lineHeight: 26, marginVertical: 23 }]}>{content[info] || 'Liên hệ TechShop để được tư vấn và hỗ trợ. Thông tin trên giao diện hiện là dữ liệu mẫu.'}</Text><Button onPress={() => setInfo('')}>Đã hiểu</Button></View></View></Modal>;
}
