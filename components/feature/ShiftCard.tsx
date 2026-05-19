import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Shift } from '@/services/mockData';

interface ShiftCardProps {
  shift: Shift;
}

const SHIFT_COLORS: Record<string, string> = {
  morning: Colors.morningShift,
  evening: Colors.eveningShift,
  night: Colors.nightShift,
  overtime: Colors.overtimeShift,
  weekend: '#AB47BC',
};

const SHIFT_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  morning: 'wb-sunny',
  evening: 'wb-twilight',
  night: 'nightlight',
  overtime: 'bolt',
  weekend: 'weekend',
};

export const ShiftCard = memo(function ShiftCard({ shift }: ShiftCardProps) {
  const color = SHIFT_COLORS[shift.type] || Colors.accent;
  const icon = SHIFT_ICONS[shift.type] || 'schedule';

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={[styles.typeIcon, { backgroundColor: color + '18' }]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{shift.employeeName}</Text>
          <StatusBadge variant={shift.status as any} size="sm" />
        </View>
        <Text style={styles.role}>{shift.role}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialIcons name="schedule" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>{shift.startTime} – {shift.endTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="location-on" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>{shift.site}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.card,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    borderLeftWidth: 4,
    gap: Spacing.sm,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
    includeFontPadding: false,
  },
  role: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    includeFontPadding: false,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    includeFontPadding: false,
  },
});
