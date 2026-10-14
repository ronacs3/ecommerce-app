# TechShop

Frontend Expo SDK 57 / React Native / Expo Router với giao diện TechShop, kết nối backend tại https://backend-e-commerce-navy.vercel.app/api (Tài liệu API Swagger: https://backend-e-commerce-navy.vercel.app/api-docs/).

## Chạy frontend

```sh
npm ci
npm run web
```

Mở http://localhost:3000 hoặc dùng ứng dụng Expo Go trên thiết bị di động.

API mặc định là `https://backend-e-commerce-navy.vercel.app/api` được cấu hình trong `.env` và `src/config/api.ts`. Bạn có thể thay đổi biến `EXPO_PUBLIC_API_URL` trong `.env` nếu cần chuyển sang máy chủ khác. Xem `.env.example`. Khi thay đổi biến môi trường cần khởi động lại Expo dev server.

## Chức năng đã ghép API

- GET /products, /categories: catalog thật, ánh xạ ID danh mục thành tên tiếng Việt. Lọc và tìm kiếm không dấu thực hiện trên catalog tại client để tránh sự khác biệt về category giữa dữ liệu và controller.
- GET /products/:id: chi tiết sản phẩm và kiểm tra lại giá/tồn kho trước khi gửi đơn.
- POST /users/login và /users: đăng nhập, đăng ký thật; GET /users/profile: khôi phục và kiểm tra phiên JWT.
- POST /coupons/validate: xác nhận mã và danh mục áp dụng. Giảm giá chỉ tính trên các dòng sản phẩm phù hợp.
- POST /orders: tạo đơn COD thật với địa chỉ, thành phố, mã bưu chính, quốc gia, product ID và số lượng. Tổng cuối cùng sử dụng phản hồi của backend.
- GET /orders/myorders: đơn của người dùng; GET /orders: toàn bộ đơn cho Admin.
- PUT /orders/:id/pay, /deliver, /cancel: xác nhận thanh toán/giao hàng hoặc hủy qua endpoint riêng, không mô phỏng việc đổi trạng thái tại client.
- Admin: CRUD sản phẩm, xem người dùng, tạo/xóa mã giảm giá và thống kê /orders/stats.
- Backend không có PUT mã giảm giá, vì vậy giao diện hỗ trợ tạo/xóa và không hiển thị nút bật/tắt giả.

Giỏ hàng và yêu thích là dữ liệu frontend vì API không có endpoint giỏ hàng. Khóa localStorage chứa địa chỉ backend để không trộn dữ liệu giữa các môi trường. Không dùng sản phẩm, đơn hàng hoặc mã giảm giá demo làm fallback khi API lỗi.

JWT dùng sessionStorage trên web và Expo SecureStore trên native. Không lưu mật khẩu. Admin yêu cầu tài khoản `isAdmin`; backend vẫn kiểm tra JWT/quyền cho mọi yêu cầu bảo vệ. Đăng xuất hoặc 401 xóa phiên và dữ liệu đơn hàng riêng tư khỏi giao diện.

## Cấu trúc

```text
src/
  app/                 # Route và root providers
  pages/customer/      # Màn hình mua sắm, đăng nhập, tài khoản
  pages/admin/         # Admin có kiểm tra quyền
  components/          # UI dùng chung, sản phẩm, giỏ hàng, đơn hàng
  layouts/             # Khung trang TechShop
  contexts/            # AuthProvider, StoreProvider, trạng thái UI
  hooks/               # useAuth, useShop, useCatalog, useCategories
  services/api/        # HTTP client, DTO adapters, catalog, coupons, orders
  services/            # Lưu JWT và giỏ/yêu thích
  config/api.ts        # Base URL / URL ảnh
  types/               # DTO backend và model frontend
  data/                # State rỗng; fixtures sản phẩm chỉ dùng cho tests
  utils/               # Tìm kiếm, tính tiền, mã giảm giá theo danh mục
  styles/              # StyleSheet
```

## Kiểm tra

```sh
npm run lint
npm run typecheck
npm test
npm run test:api-live
npx expo export --platform web
```

`npm test` chạy 19 kiểm tra nghiệp vụ cùng kiểm tra hợp đồng API giả lập: ID chuỗi, category ID/tên/populated object, URL ảnh, mã theo danh mục, payload CRUD/đơn hàng, JWT và xử lý 401.

`test:api-live` chỉ đọc sản phẩm/danh mục/chi tiết, kiểm tra CORS/preflight và 401 cho khách chưa đăng nhập. Không tạo tài khoản/đơn hàng, không gửi email và không thay đổi dữ liệu backend. Luồng ghi xác thực được kiểm tra bằng API giả lập; cần dùng tài khoản của bạn trên UI để kiểm tra end-to-end với backend.

## Giới hạn hiện tại

- Một số URL /images/... do backend trả về đang 404; frontend hiển thị placeholder, không dùng ảnh minh họa sai sản phẩm. Cần bổ sung ảnh/static serving ở backend.
- Cart native giữ trong phiên chạy; JWT native được lưu an toàn bằng SecureStore.
- Blog và nội dung chính sách/liên hệ là nội dung frontend. Chat AI, upload ảnh, đánh giá, quản lý danh mục và khôi phục mật khẩu chưa có UI kết nối trong phạm vi thay thế các chức năng hiện có.
- Cổng thanh toán chưa có trong API. Đơn tạo với COD; Admin chỉ xác nhận thanh toán đã xảy ra.
- Controller tạo đơn hiện tại chưa kiểm tra tồn kho nguyên tử/transaction và còn nhận phí ship/tax từ client. Frontend kiểm tra lại giá/tồn kho và tránh bấm gửi trùng, nhưng backend cần bổ sung validation/transaction trước khi vận hành thực tế. Không sửa mã nguồn backend trong lần tích hợp này.
- Endpoint tạo đơn/đăng ký/giao hàng có thể gửi email thật khi người dùng thao tác. Các kiểm tra tự động không gọi các mutation này trên backend thật.