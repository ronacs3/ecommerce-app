import { useEffect, useRef, useState, type ReactNode } from 'react';
import { clearToken, loadToken, saveToken } from '@/services/authStorage';
import { ApiError, errorMessage, request, setAccessToken, setUnauthorizedHandler } from '@/services/api/http';
import { mapUser } from '@/services/api/adapters';
import type { ApiUser } from '@/types/api';
import type { User } from '@/types/shop';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const authenticating = useRef(false);
  useEffect(() => {
    let cancelled = false;
    setUnauthorizedHandler(() => {
      generation.current++;
      setUser(null); setAccessToken(null); setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      void clearToken().catch(() => {});
    });
    const current = generation.current;
    loadToken().then(async token => {
      if (cancelled || current !== generation.current) return;
      if (token) {
        setAccessToken(token);
        const data = await request<ApiUser>('/users/profile', { auth: true });
        if (!cancelled && current === generation.current) setUser(mapUser(data));
      }
    }).catch(e => { if (!cancelled) setError(errorMessage(e)); }).finally(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; setUnauthorizedHandler(null); };
  }, []);
  async function authenticate(path: string, body: { name?: string; email: string; password: string }) {
    if (authenticating.current) throw new Error('Yêu cầu đăng nhập đang được xử lý.');
    authenticating.current = true; setBusy(true); setError('');
    generation.current++;
    try {
      const data = await request<ApiUser>(path, { method: 'POST', body, timeout: 60000 });
      if (!data.token) throw new ApiError('API đăng nhập không trả về JWT.');
      setAccessToken(data.token);
      const currentUser = mapUser(data);
      setUser(currentUser);
      try { await saveToken(data.token); } catch { setError('Đã đăng nhập, nhưng không lưu được phiên trên thiết bị này.'); }
      return currentUser;
    } catch (e) { setError(errorMessage(e)); throw e; }
    finally { authenticating.current = false; setBusy(false); setReady(true); }
  }
  async function logout() {
    generation.current++; setAccessToken(null); setUser(null); setError('');
    try { await clearToken(); } catch { /* The active session is already cleared. */ }
  }
  async function refreshSession() {
    setError('');
    try { setUser(mapUser(await request<ApiUser>('/users/profile', { auth: true }))); }
    catch (e) { setError(errorMessage(e)); throw e; }
  }
  return <AuthContext.Provider value={{ user, ready, busy, error, login: (email, password) => authenticate('/users/login', { email, password }), register: (name, email, password) => authenticate('/users', { name, email, password }), logout, refreshSession }}>{children}</AuthContext.Provider>;
}
