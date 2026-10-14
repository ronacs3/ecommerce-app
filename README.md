# form & field

Ứng dụng ecommerce nội thất bằng Expo SDK 57, React Native và Expo Router. Giao diện responsive với sidebar trên desktop, menu trên mobile, màu sage và kem.

## Chạy dự án

```sh
npm ci
npm run web
# Android / iOS
npm start
```

## Cấu trúc mã nguồn

```text
src/
  app/                    # Route Expo Router; mỗi file trỏ tới một page
  pages/
    customer/             # Home, catalog, collections, cart, checkout, account, about
    admin/                # Trang quản trị
  layouts/                # StoreLayout: khung trang và trạng thái UI dùng chung
  components/
    common/               # Button, Field, Icon, InfoModal
    layout/               # Header, sidebar, footer
    products/             # Danh sách và modal chi tiết sản phẩm
    cart/                 # Giao diện dùng chung cho giỏ hàng và checkout
    orders/               # Danh sách đơn hàng
  contexts/               # ShopContext, StoreProvider, StoreUIContext
  hooks/                  # useShop, useStoreUI, useCatalog
  services/               # Đọc và ghi dữ liệu localStorage
  types/                  # Kiểu dữ liệu và khai báo asset
  data/                   # Sản phẩm mẫu và state khởi tạo
  constants/              # Danh mục, ảnh và hằng số giao diện
  utils/                  # Tính tiền và định dạng tiền
  styles/                 # StyleSheet dùng chung
```

Màn hình khách hàng và Admin được tách riêng. Các page sử dụng components và hooks; provider quản lý dữ liệu qua service lưu trữ. Không đặt components, hooks hoặc nghiệp vụ trong `src/app/`. Khi thêm màn hình, tạo page trong `src/pages/` và một file route tương ứng trong `src/app/`.

Lần tổ chức lại cấu trúc giữ nguyên nội dung JSX, các giá trị StyleSheet, URL màn hình và khóa localStorage. HTML render của 9 màn hình đã được đối chiếu với bản trước khi tách file.

## Chức năng

- Khám phá, danh mục, bộ sưu tập, tìm kiếm và sắp xếp giá.
- Chi tiết sản phẩm, wishlist, giỏ hàng và giới hạn số lượng theo tồn kho.
- Checkout kiểm tra thông tin giao hàng, mã giảm giá và phí vận chuyển.
- Mã mẫu: WELCOME10 (10%) và HOME20 (20%). Mã áp dụng được giữ khi chuyển từ giỏ hàng sang checkout.
- Miễn phí vận chuyển từ $150 trước giảm giá; đơn thấp hơn có phí $12. Tiền được tính và làm tròn theo cent.
- Đặt đơn mô phỏng sẽ trừ tồn kho, xóa giỏ hàng và tạo đơn trong tài khoản và Admin.
- Admin tại /admin: tổng quan, thêm/sửa/xóa sản phẩm, tồn kho, trạng thái đơn, mã giảm giá và danh sách khách hàng.

## Lưu trữ và phạm vi

Bản demo dùng React Context. Trên web, giỏ hàng, sản phẩm, wishlist, mã giảm giá và đơn hàng được lưu bằng localStorage. Trên native, dữ liệu tồn tại trong phiên chạy.

Chưa kết nối backend, xác thực/phân quyền, email marketing hay cổng thanh toán. Checkout không thu tiền thật. Admin hiển thị công khai phục vụ demo; cần xác thực và kiểm tra giá/tồn kho phía server trước khi triển khai kinh doanh. Hình ảnh tải từ Unsplash.

## Kiểm tra

```sh
npm run lint
npm run typecheck
npm test
npx expo export --platform web
```

Các kiểm tra logic bao phủ mã giảm giá, ngưỡng miễn phí vận chuyển, giỏ trống và làm tròn tiền.
