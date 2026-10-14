import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { green } from '@/constants/catalog';
import { useCategories } from '@/hooks/useCategories';
import { useStoreUI } from '@/hooks/useStoreUI';
import { s } from '@/styles/store';
import { money } from '@/utils/money';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

type Props = { category?: string; keyword?: string; min?: string; max?: string; mobile: boolean };

export function ProductFilters({ category, keyword, min, max, mobile }: Props) {
  const categories = useCategories();
  const { go } = useStoreUI();
  const [term, setTerm] = useState(keyword || '');
  const [selectedCategory, setCategory] = useState(category || '');
  const [minPrice, setMinPrice] = useState(min || '0');
  const [maxPrice, setMaxPrice] = useState(max || '50000000');
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState('');
  function apply() {
    const lower = Number(minPrice);
    const upper = Number(maxPrice);
    if (!Number.isFinite(lower) || !Number.isFinite(upper) || lower < 0 || upper < lower) { setError('Khoảng giá không hợp lệ. Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu.'); return; }
    const query = [`min=${Math.round(lower)}`, `max=${Math.round(upper)}`];
    if (selectedCategory) query.push(`category=${encodeURIComponent(selectedCategory)}`);
    if (term.trim()) query.push(`keyword=${encodeURIComponent(term.trim())}`);
    go(`/?${query.join('&')}`);
  }
  return <View style={[s.filterPanel, mobile && { width: '100%' }]}>
    <View style={s.filterPanelHeading}><View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Icon name="filter" size={17} color={green} /><Text style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>Bộ lọc sản phẩm</Text></View><Pressable onPress={() => { setTerm(''); setCategory(''); setMinPrice('0'); setMaxPrice('50000000'); setError(''); go('/'); }} style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}><Icon name="reset" size={12} color="#64748b" /><Text style={{ fontSize: 10, color: '#64748b' }}>Đặt lại</Text></Pressable></View>
    <View><Text style={s.filterLabel}>Từ khóa</Text><View style={[s.filterSelect, { paddingRight: 8 }]}><Icon name="search" size={15} color="#94a3b8" /><TextInput accessibilityLabel="Từ khóa bộ lọc" style={{ flex: 1, minWidth: 0, fontSize: 11, paddingVertical: 10, color: '#0f172a' }} placeholder="Tên sản phẩm, thương hiệu..." value={term} onChangeText={setTerm} /></View></View>
    <View><Text style={s.filterLabel}>Danh mục</Text><Pressable accessibilityLabel="Chọn danh mục" onPress={() => setExpanded(!expanded)} style={s.filterSelect}><Text style={{ fontSize: 12, color: '#475569' }}>{selectedCategory || 'Tất cả danh mục'}</Text><Text style={{ color: '#94a3b8' }}>⌄</Text></Pressable>{expanded && <View style={{ paddingTop: 9 }}>{['', ...categories].map(c => <Pressable key={c} onPress={() => { setCategory(c); setExpanded(false); }} style={s.radioOption}><Text style={{ color: green }}>{c === selectedCategory ? '◉' : '○'}</Text><Text style={{ fontSize: 12, color: '#475569' }}>{c || 'Tất cả danh mục'}</Text></Pressable>)}</View>}</View>
    <View><Text style={s.filterLabel}>Khoảng giá (VNĐ)</Text><View style={{ flexDirection: 'row', gap: 8 }}><TextInput accessibilityLabel="Giá tối thiểu" style={[s.field, { flex: 1, minWidth: 0, paddingHorizontal: 8, fontSize: 11 }]} keyboardType="numeric" value={minPrice} onChangeText={setMinPrice} /><TextInput accessibilityLabel="Giá tối đa" style={[s.field, { flex: 1, minWidth: 0, paddingHorizontal: 8, fontSize: 11 }]} keyboardType="numeric" value={maxPrice} onChangeText={setMaxPrice} /></View><Text style={{ color: '#64748b', fontSize: 10, marginTop: 12 }}>{money(Number(minPrice) || 0)}  đến  {money(Number(maxPrice) || 0)}</Text></View>
    {!!error && <Text style={{ color: '#dc2626', fontSize: 11, lineHeight: 18 }}>{error}</Text>}
    <Button onPress={apply}>Áp dụng bộ lọc</Button>
  </View>;
}
