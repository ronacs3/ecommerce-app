import Feather from '@expo/vector-icons/Feather';
import React from 'react';

const names: Record<string, React.ComponentProps<typeof Feather>['name']> = { home: 'home', shop: 'grid', collections: 'layers', heart: 'heart', bag: 'shopping-bag', admin: 'settings', arrow: 'arrow-up-right', search: 'search', close: 'x', check: 'check', leaf: 'feather', truck: 'truck', box: 'package', shield: 'shield', menu: 'menu' };
export function Icon({ name, size = 22, color = '#626d55' }: { name: string; size?: number; color?: string }) { return <Feather name={names[name] || 'circle'} size={size} color={color} />; }
