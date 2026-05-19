import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '@/constants/theme';

type BadgeVariant =
  | 'success' | 'warning' | 'error' | 'info'
  | 'morning' | 'evening' | 'night' | 'overtime' | 'weekend'
  | 'active' | 'inactive' | 'on-leave'
  | 'present' | 'absent' | 'late'
  | 'valid' | 'expiring' | 'expired'
  | 'pending' | 'approved' | 'rejected'
  | 'scheduled' | 'completed' | 'missed';

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  success:   { bg: Colors.successLight,  text: Colors.success },
  warning:   { bg: Colors.warningLight,  text: '#E65100' },
  error:     { bg: Colors.errorLight,    text: Colors.error },
  info:      { bg: Colors.infoLight,     text: '#1565C0' },
  morning:   { bg: '#E3F2FD',            text: Colors.morningShift },
  evening:   { bg: '#FFF3E0',            text: Colors.eveningShift },
  night:     { bg: '#EDE7F6',            text: Colors.nightShift },
  overtime:  { bg: '#FFEBEE',            text: Colors.overtimeShift },
  weekend:   { bg: '#F3E5F5',            text: '#7B1FA2' },
  active:    { bg: Colors.successLight,  text: Colors.success },
  inactive:  { bg: '#F5F5F5',            text: Colors.textMuted },
  'on-leave':{ bg: Colors.warningLight,  text: '#E65100' },
  present:   { bg: Colors.successLight,  text: Colors.success },
  absent:    { bg: Colors.errorLight,    text: Colors.error },
  late:      { bg: Colors.warningLight,  text: '#F57F17' },
  valid:     { bg: Colors.successLight,  text: Colors.success },
  expiring:  { bg: Colors.warningLight,  text: '#E65100' },
  expired:   { bg: Colors.errorLight,    text: Colors.error },
  pending:   { bg: Colors.infoLight,     text: '#1565C0' },
  approved:  { bg: Colors.successLight,  text: Colors.success },
  rejected:  { bg: Colors.errorLight,    text: Colors.error },
  scheduled: { bg: Colors.infoLight,     text: '#1565C0' },
  completed: { bg: Colors.successLight,  text: Colors.success },
  missed:    { bg: Colors.errorLight,    text: Colors.error },
};

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge = memo(function StatusBadge({ variant, label, size = 'md' }: StatusBadgeProps) {
  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
  const displayLabel = label || variant.charAt(0).toUpperCase() + variant.slice(1).replace('-', ' ');
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }, size === 'sm' && styles.badgeSm]}>
      <Text style={[styles.text, { color: style.text }, size === 'sm' && styles.textSm]}>
        {displayLabel}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    includeFontPadding: false,
  },
  textSm: {
    fontSize: 10,
  },
});
