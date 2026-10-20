import Feather from '@expo/vector-icons/Feather';
import React from 'react';

const names: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  home: 'home', shop: 'grid', collections: 'layers', heart: 'heart', bag: 'shopping-cart', admin: 'settings',
  arrow: 'arrow-up-right', right: 'arrow-right', search: 'search', close: 'x', check: 'check', 'check-circle': 'check-circle',
  leaf: 'feather', truck: 'truck', box: 'package', shield: 'shield', menu: 'menu', zap: 'zap', user: 'user',
  book: 'book-open', laptop: 'monitor', phone: 'smartphone', tag: 'tag', headphones: 'headphones', monitor: 'monitor',
  watch: 'watch', filter: 'sliders', reset: 'rotate-ccw', support: 'headphones', gift: 'gift', mail: 'mail',
  location: 'map-pin', star: 'star', logout: 'log-out', copy: 'copy', share: 'share-2', info: 'info',
  help: 'help-circle', message: 'message-square', send: 'send', compare: 'columns', clock: 'clock',
  percent: 'percent', 'down-arrow': 'chevron-down', 'up-arrow': 'chevron-up', 'phone-call': 'phone-call'
};
export function Icon({ name, size = 22, color = '#475569' }: { name: string; size?: number; color?: string }) { return <Feather name={names[name] || 'circle'} size={size} color={color} />; }
