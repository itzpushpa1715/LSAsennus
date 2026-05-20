// StatCard — KPI summary widget
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadow } from '@/constants/theme';

interface Props {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  sub?: string;
}

export function StatCard({ label, value, icon, color = Colors.primary, sub }: Props) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
        <MaterialIcons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, minWidth: '44%',
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    padding: Spacing.md, gap: Spacing.xs,
    borderTopWidth: 3,
    ...Shadow.card, borderWidth: 1, borderColor: Colors.border,
  },
  iconWrap: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  label: { fontSize: FontSize.xs, color: Colors.textSecondary, includeFontPadding: false },
  sub: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
});
