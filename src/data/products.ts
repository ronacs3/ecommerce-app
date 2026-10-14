import type { Product } from '@/types/shop';

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=750&q=85`;

// Local demo catalog. Prices and availability do not come from the reference site.
export const initialProducts: Product[] = [
  { id: '1', name: 'MacBook Air M3 13 inch', category: 'Laptop', price: 24990000, oldPrice: 27990000, image: photo('photo-1517336714731-489689fd1ca8'), tag: 'Bán chạy', colors: ['#c8c8c8', '#354152'], stock: 18, specs: ['Apple M3 · RAM 16GB', 'SSD 256GB · Màn hình Retina'] },
  { id: '2', name: 'iPhone 16 128GB Chính hãng', category: 'Điện thoại', price: 18990000, oldPrice: 22990000, image: photo('photo-1592750475338-74b7b21085ab'), tag: 'Giảm giá', colors: ['#262d36', '#dee7de'], stock: 24, specs: ['Chip A18 · Màn hình 6.1 inch', 'Camera 48MP · Bảo hành 12 tháng'] },
  { id: '3', name: 'Sony WH-1000XM5 Wireless', category: 'Tai nghe', price: 6490000, oldPrice: 7990000, image: photo('photo-1546435770-a3e426bf472b'), tag: 'Bán chạy', colors: ['#242424', '#dfd9cb'], stock: 15, specs: ['Chống ồn chủ động ANC', 'Bluetooth · Pin đến 30 giờ'] },
  { id: '4', name: 'Logitech MX Master 3S', category: 'Phụ kiện', price: 2190000, image: photo('photo-1527814050087-3793815479db'), tag: 'Mới', colors: ['#292d33', '#c9cccf'], stock: 35, specs: ['Chuột không dây · 8.000 DPI', 'Kết nối đa thiết bị · USB-C'] },
  { id: '5', name: 'Màn hình Dell UltraSharp 27 inch', category: 'Màn hình', price: 8990000, oldPrice: 9990000, image: photo('photo-1527443224154-c4a3942d3acf'), colors: ['#242d33'], stock: 9, specs: ['IPS · Độ phân giải QHD', 'USB-C · Thiết kế viền mỏng'] },
  { id: '6', name: 'Apple Watch Series 10 GPS', category: 'Đồng hồ', price: 9990000, image: photo('photo-1523275335684-37898b6baf30'), tag: 'Mới', colors: ['#c4c8cc', '#242d33'], stock: 16, specs: ['Màn hình Always-On Retina', 'Theo dõi sức khỏe · Chống nước'] },
  { id: '7', name: 'ASUS Vivobook 15 OLED', category: 'Laptop', price: 16490000, oldPrice: 18990000, image: photo('photo-1496181133206-80ce9b88a853'), colors: ['#b9bec5', '#24364a'], stock: 12, specs: ['Intel Core i5 · RAM 16GB', 'SSD 512GB · OLED Full HD'] },
  { id: '8', name: 'Bàn phím cơ Keychron K2', category: 'Phụ kiện', price: 1890000, oldPrice: 2190000, image: photo('photo-1587829741301-dc798b83add3'), colors: ['#38414a'], stock: 28, specs: ['Wireless · 75% layout', 'Đèn nền RGB · Hot-swappable'] },
  { id: '9', name: 'Cáp sạc USB-C 100W', category: 'Phụ kiện', price: 199000, oldPrice: 299000, image: photo('photo-1583863788434-e58a36330cf0'), colors: ['#252b33'], stock: 50, specs: ['Sạc nhanh PD · Dài 1.5m', 'Tương thích điện thoại và laptop'] },
];
