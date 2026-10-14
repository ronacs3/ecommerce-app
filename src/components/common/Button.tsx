import { green } from '@/constants/catalog';
import { s } from '@/styles/store';
import React from 'react';
import { Pressable,Text } from 'react-native';

export function Button({ children, onPress, secondary = false, disabled = false }: { children: React.ReactNode; onPress: () => void; secondary?: boolean; disabled?: boolean }) { return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondaryButton, pressed && { opacity: 0.8 }, disabled && { opacity: 0.4 }]}><Text style={[s.buttonText, secondary && { color: green }]}>{children}</Text></Pressable>; }
