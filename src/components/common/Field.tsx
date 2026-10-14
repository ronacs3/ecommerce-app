import { s } from '@/styles/store';
import { Text,TextInput,View } from 'react-native';

export function Field({ label, value, onChange, placeholder, numeric = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; numeric?: boolean }) { return <View style={{ gap: 8 }}><Text style={s.fieldLabel}>{label}</Text><TextInput accessibilityLabel={label} style={s.field} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#92978e" keyboardType={numeric ? 'numeric' : label.includes('Email') ? 'email-address' : 'default'} autoCapitalize={label.includes('Email') ? 'none' : 'sentences'} /></View>; }
