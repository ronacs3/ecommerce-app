import { API_URL } from '@/config/api';

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;
export const setAccessToken = (token: string | null) => { accessToken = token; };
export const setUnauthorizedHandler = (handler: (() => void) | null) => { onUnauthorized = handler; };
export class ApiError extends Error {
  constructor(message: string, public status = 0, public code = 'API_ERROR') { super(message); this.name = 'ApiError'; }
}
export function errorMessage(error: unknown) { return error instanceof Error ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.'; }
type Options = { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown; auth?: boolean; timeout?: number; signal?: AbortSignal };

export async function request<T>(path: string, options: Options = {}): Promise<T> {
  if (options.auth && !accessToken) throw new ApiError('Vui lòng đăng nhập để tiếp tục.', 401);
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = setTimeout(abort, options.timeout ?? 15000);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET', signal: controller.signal,
      headers: { Accept: 'application/json', ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(options.auth ? { Authorization: `Bearer ${accessToken}` } : {}) },
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    });
    const text = await response.text();
    let data: unknown = null;
    try { if (text) data = JSON.parse(text); } catch { if (response.ok) throw new ApiError('API trả về dữ liệu không đúng định dạng JSON.', response.status); }
    if (!response.ok) {
      if (options.auth && response.status === 401) onUnauthorized?.();
      const message = data && typeof data === 'object' && 'message' in data && typeof data.message === 'string' ? data.message : `Yêu cầu không thành công (${response.status}).`;
      throw new ApiError(message, response.status);
    }
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) throw new ApiError('Kết nối quá thời gian. Vui lòng kiểm tra kết quả trước khi thử lại.', 0, 'TIMEOUT');
    throw new ApiError('Không kết nối được API. Kiểm tra backend, địa chỉ API và mạng của thiết bị.', 0, 'NETWORK');
  } finally { clearTimeout(timer); options.signal?.removeEventListener('abort', abort); }
}
