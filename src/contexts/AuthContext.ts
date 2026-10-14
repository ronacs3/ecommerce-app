import { createContext } from 'react';
import type { User } from '@/types/shop';

export type Auth = {
  user: User | null; ready: boolean; busy: boolean; error: string;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};
export const AuthContext = createContext<Auth | null>(null);
