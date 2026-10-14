import type { Product } from '@/types/shop';

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=850&q=85`;

export const initialProducts: Product[] = [
  { id: 1, name: 'The Sunday Lounge Chair', category: 'Furniture', price: 249, oldPrice: 299, image: photo('photo-1567538096630-e0c55bd6374c'), tag: 'Bestseller', colors: ['#c5b59c','#a3aaa0','#54594c'], stock: 18 },
  { id: 2, name: 'Solstice Ceramic Vase', category: 'Decor', price: 38, image: photo('photo-1578749556568-bc2c40e68b61'), tag: 'New', colors: ['#c8b69b','#c9c8bf'], stock: 32 },
  { id: 3, name: 'Arc Table Lamp', category: 'Lighting', price: 89, image: photo('photo-1507473885765-e6ed057f782c'), colors: ['#c9bda9','#3e453c'], stock: 12 },
  { id: 4, name: 'Everyday Linen Cushion', category: 'Textiles', price: 32, image: photo('photo-1584100936595-c0654b55a2e2'), tag: 'Bestseller', colors: ['#abb098','#cbb59b','#d8d2c2'], stock: 40 },
  { id: 5, name: 'Oak Side Table', category: 'Furniture', price: 129, image: photo('photo-1499933374294-4584851497cc'), colors: ['#bd9b70','#80634c'], stock: 8 },
  { id: 6, name: 'Woven Storage Basket', category: 'Decor', price: 45, image: photo('photo-1600210492486-724fe5c67fb0'), colors: ['#bd9b70','#d4c7b1'], stock: 22 },
];
