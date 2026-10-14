import { Platform } from 'react-native';

// Android emulator reaches the development machine through 10.0.2.2.
const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || `http://${defaultHost}:5000/api`).replace(/\/+$/, '');
export const API_ORIGIN = API_URL.replace(/\/api$/, '');
export function assetUrl(value: string) {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `${API_ORIGIN}/${value.replace(/^\/+/, '')}`;
}
