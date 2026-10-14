
export const DEFAULT_API_URL = 'https://backend-e-commerce-navy.vercel.app/api';
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');
export const API_ORIGIN = API_URL.replace(/\/api$/, '');
export function assetUrl(value: string) {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `${API_ORIGIN}/${value.replace(/^\/+/, '')}`;
}
