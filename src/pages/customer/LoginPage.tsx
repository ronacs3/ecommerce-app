import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { Icon } from '@/components/common/Icon';
import { useAuth } from '@/hooks/useAuth';
import { useStoreUI } from '@/hooks/useStoreUI';
import { errorMessage } from '@/services/api/http';
import { s } from '@/styles/store';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function LoginPage() {
  const auth = useAuth();
  const { go, notify } = useStoreUI();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function submit() {
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password || (registering && (password.length < 6 || !name.trim()))) { setError('Nhập email hợp lệ, mật khẩu và họ tên khi đăng ký (mật khẩu từ 6 ký tự).'); return; }
    try {
      const user = registering ? await auth.register(name.trim(), email.trim(), password) : await auth.login(email.trim(), password);
      setPassword(''); notify(registering ? 'Đăng ký thành công.' : `Chào mừng ${user.name}!`);
      const allowed = ['/checkout', '/cart', '/account', '/admin', '/'];
      go(redirect && allowed.includes(redirect) ? redirect : user.isAdmin ? '/admin' : '/account');
    } catch (e) { setError(errorMessage(e)); }
  }
  if (!auth.ready) return <View style={s.empty}><Text style={s.sectionSubtitle}>Đang kiểm tra phiên đăng nhập…</Text></View>;
  if (auth.user) return <View style={s.empty}><Text style={s.sectionTitle}>Xin chào, {auth.user.name}</Text><Text style={s.sectionSubtitle}>{auth.user.email}</Text><Button onPress={() => go(auth.user?.isAdmin ? '/admin' : '/account')}>Mở tài khoản</Button><Button secondary onPress={() => { void auth.logout().then(() => go('/')); }}>Đăng xuất</Button></View>;
  return <View style={[s.panel, { width: 440, maxWidth: '100%', alignSelf: 'center', marginVertical: 30, gap: 20, padding: 30 }]}>
    <View style={[s.brandIcon, { alignSelf: 'center' }]}><Icon name="user" size={23} color="#fff" /></View>
    <Text style={[s.sectionTitle, { textAlign: 'center' }]}>{registering ? 'Tạo tài khoản TechShop' : 'Chào mừng đến TechShop'}</Text><Text style={[s.sectionSubtitle, { textAlign: 'center' }]}>{registering ? 'Đăng ký để mua sắm và theo dõi đơn hàng.' : 'Đăng nhập để tiếp tục mua sắm.'}</Text>
    {registering && <Field label="Họ và tên" value={name} onChange={setName} />}
    <Field label="Email" value={email} onChange={setEmail} placeholder="ban@example.com" />
    <Text style={s.fieldLabel}>Mật khẩu</Text><TextInput accessibilityLabel="Mật khẩu" style={s.field} value={password} onChangeText={setPassword} placeholder="Nhập mật khẩu" autoCapitalize="none" secureTextEntry onSubmitEditing={() => { if (!auth.busy) void submit(); }} />
    {!!(error || auth.error) && <Text accessibilityLiveRegion="polite" style={{ color: '#dc2626', fontSize: 12 }}>{error || auth.error}</Text>}
    <Button disabled={auth.busy} onPress={() => { void submit(); }}>{auth.busy ? 'Đang xử lý…' : registering ? 'Đăng ký' : 'Đăng nhập'}</Button>
    <Pressable disabled={auth.busy} onPress={() => { setRegistering(!registering); setError(''); }}><Text style={[s.viewLink, { textAlign: 'center' }]}>{registering ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}</Text></Pressable>
    <Button secondary onPress={() => go('/')}>Quay lại mua sắm</Button>
  </View>;
}
