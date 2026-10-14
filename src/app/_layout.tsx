import { Slot } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '@/contexts/StoreProvider';
import { StoreLayout } from '@/layouts/StoreLayout';
import { AuthProvider } from '@/contexts/AuthProvider';
export default function RootLayout() {
  return <SafeAreaProvider><Head><title>TechShop — Cửa hàng công nghệ chính hãng</title><meta name="description" content="Khám phá laptop, điện thoại, phụ kiện và thiết bị công nghệ cùng TechShop. Trải nghiệm mua sắm thuận tiện, ưu đãi hấp dẫn." /></Head><AuthProvider><StoreProvider><StoreLayout><Slot /></StoreLayout></StoreProvider></AuthProvider></SafeAreaProvider>;
}
