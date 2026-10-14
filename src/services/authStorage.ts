import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from '@/config/api';

const WEB_KEY = `techshop-session:${API_URL}`;
const NATIVE_KEY = 'techshop-api-token';
export async function loadToken(): Promise<string | null> {
  if (Platform.OS === 'web') { try { return sessionStorage.getItem(WEB_KEY); } catch { return null; } }
  return SecureStore.getItemAsync(NATIVE_KEY);
}
export async function saveToken(token: string) {
  if (Platform.OS === 'web') { sessionStorage.setItem(WEB_KEY, token); return; }
  await SecureStore.setItemAsync(NATIVE_KEY, token);
}
export async function clearToken() {
  if (Platform.OS === 'web') { try { sessionStorage.removeItem(WEB_KEY); } catch { /* In-memory sign-out still works. */ } return; }
  await SecureStore.deleteItemAsync(NATIVE_KEY);
}
