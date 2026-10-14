import Feather from '@expo/vector-icons/Feather';
import React from 'react';

const names: Record<string, React.ComponentProps<typeof Feather>['name']> = { home: 'home', shop: 'grid', collections: 'layers', heart: 'heart', bag: 'shopping-cart', admin: 'settings', arrow: 'arrow-up-right', right: 'arrow-right', search: 'search', close: 'x', check: 'check', leaf: 'feather', truck: 'truck', box: 'package', shield: 'shield', menu: 'menu', zap: 'zap', user: 'user', book: 'book-open', laptop: 'monitor', phone: 'smartphone', tag: 'tag', headphones: 'headphones', monitor: 'monitor', watch: 'watch', filter: 'sliders', reset: 'rotate-ccw', support: 'headphones', gift: 'gift', mail: 'mail', location: 'map-pin', star: 'star', logout: 'log-out' };
export function Icon({ name, size = 22, color = '#475569' }: { name: string; size?: number; color?: string }) { return <Feather name={names[name] || 'circle'} size={size} color={color} />; }
