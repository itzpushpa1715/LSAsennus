// EmployeeAvatar — initials fallback
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface Props {
  name: string;
  size?: number;
  color?: string;
}

const AVATAR_COLORS = [Colors.primary, Colors.success, Colors.warning, Colors.info, '#8B5CF6', '#EC4899'];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function EmployeeAvatar({ name, size = 44, color }: Props) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const bgColor = color || colorForName(name);
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
      <Text style={[styles.text, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  text: { color: Colors.textInverse, fontWeight: FontWeight.bold, includeFontPadding: false },
});
