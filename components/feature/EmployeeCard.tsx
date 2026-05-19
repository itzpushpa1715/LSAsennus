import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Employee } from '@/services/mockData';

interface EmployeeCardProps {
  employee: Employee;
  onPress?: () => void;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

const DEPT_COLORS: Record<string, string> = {
  Electrical: Colors.morningShift,
  Welding: Colors.copper,
  Piping: Colors.activeProject,
  Operations: Colors.accent,
  Administration: Colors.nightShift,
};

export const EmployeeCard = memo(function EmployeeCard({ employee, onPress }: EmployeeCardProps) {
  const deptColor = DEPT_COLORS[employee.department] || Colors.accent;
  const expiringCount = employee.documents.filter(d => d.status === 'expiring' || d.status === 'expired').length;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.88 }]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: deptColor + '22' }]}>
        <Text style={[styles.avatarText, { color: deptColor }]}>{getInitials(employee.name)}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{employee.name}</Text>
          <StatusBadge variant={employee.status as any} size="sm" />
        </View>
        <Text style={styles.role}>{employee.role}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialIcons name="badge" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>{employee.employeeId}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="business" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>{employee.department}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <MaterialIcons name="trending-up" size={12} color={Colors.success} />
            <Text style={styles.statText}>{employee.attendanceRate}% att.</Text>
          </View>
          <View style={styles.stat}>
            <MaterialIcons name="schedule" size={12} color={Colors.overtimeShift} />
            <Text style={styles.statText}>{employee.overtimeHours}h OT</Text>
          </View>
          {expiringCount > 0 ? (
            <View style={styles.stat}>
              <MaterialIcons name="warning" size={12} color={Colors.warning} />
              <Text style={[styles.statText, { color: Colors.warning }]}>{expiringCount} doc</Text>
            </View>
          ) : null}
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={20} color={Colors.borderDark} />
    </Pressable>
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
    gap: Spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
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
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    includeFontPadding: false,
  },
});
