import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '@/contexts/StoreProvider';
import { StoreLayout } from '@/layouts/StoreLayout';
export default function RootLayout() {
  return <SafeAreaProvider><StoreProvider><StoreLayout><Slot /></StoreLayout></StoreProvider></SafeAreaProvider>;
}
