// StatusBadge — semantic status chip
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '@/constants/theme';

type Variant = 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'late' | 'present' | 'absent' | 'morning' | 'evening' | 'night' | 'overtime' | string;

const VARIANT_STYLES: Record<string, { bg: string; text: string; label?: string }> = {
  active:   { bg: Colors.successLight, text: Colors.success },
  present:  { bg: Colors.successLight, text: Colors.success },
  approved: { bg: Colors.successLight, text: Colors.success },
  morning:  { bg: Colors.shiftMorning + '20', text: Colors.shiftMorning },
  inactive: { bg: Colors.surfaceAlt, text: Colors.textSecondary },
  absent:   { bg: Colors.dangerLight, text: Colors.danger },
  rejected: { bg: Colors.dangerLight, text: Colors.danger },
  pending:  { bg: Colors.warningLight, text: Colors.warning },
  late:     { bg: Colors.warningLight, text: Colors.warning },
  evening:  { bg: Colors.shiftEvening + '20', text: Colors.shiftEvening },
  night:    { bg: Colors.shiftNight + '20', text: Colors.shiftNight },
  overtime: { bg: Colors.shiftOvertime + '20', text: Colors.shiftOvertime },
};

interface Props {
  variant: Variant;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ variant, label, size = 'md' }: Props) {
  const style = VARIANT_STYLES[variant] || { bg: Colors.surfaceAlt, text: Colors.textSecondary };
  const displayLabel = label || variant.charAt(0).toUpperCase() + variant.slice(1);

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }, size === 'sm' && styles.badgeSm]}>
      <Text style={[styles.text, { color: style.text }, size === 'sm' && styles.textSm]}>
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 4 },
  badgeSm: { paddingHorizontal: Spacing.xs + 2, paddingVertical: 2 },
  text: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, textTransform: 'capitalize', includeFontPadding: false },
  textSm: { fontSize: FontSize.xs },
});
