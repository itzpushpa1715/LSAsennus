import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ShiftCard } from '@/components/feature/ShiftCard';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { useShifts } from '@/hooks/useShifts';

const SHIFT_TYPES = ['All', 'Morning', 'Evening', 'Night', 'Overtime', 'Weekend'];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ShiftsScreen() {
  const insets = useSafeAreaInsets();
  const { allShifts, getShiftsForDate, weekDates, loading } = useShifts();
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [shiftType, setShiftType] = useState('All');

  const selectedDate = weekDates[selectedDayIdx] || weekDates[0];

  const filtered = useMemo(() => {
    const dayShifts = getShiftsForDate(selectedDate);
    if (shiftType === 'All') return dayShifts;
    return dayShifts.filter(s => s.type === shiftType.toLowerCase());
  }, [selectedDate, shiftType, allShifts]);

  const dayShifts = getShiftsForDate(selectedDate);
  const summary = {
    total: dayShifts.length,
    active: dayShifts.filter(s => s.status === 'active').length,
    scheduled: dayShifts.filter(s => s.status === 'scheduled').length,
    completed: dayShifts.filter(s => s.status === 'completed').length,
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScreenHeader title="Shift Schedule" subtitle="Weekly overview" rightIcon="add" />

      {/* Week day selector */}
      <View style={styles.weekOuter}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekContent}
        >
          {weekDates.map((date, idx) => {
            const count = getShiftsForDate(date).length;
            const isSelected = selectedDayIdx === idx;
            const dayNum = date.split('-')[2];
            const dayLabel = DAY_LABELS[idx] || DAY_LABELS[idx % 7];
            return (
              <Pressable
                key={date}
                onPress={() => setSelectedDayIdx(idx)}
                style={[styles.dayBtn, isSelected && styles.dayBtnActive]}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>{dayLabel}</Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>{dayNum}</Text>
                {count > 0 ? (
                  <View style={[styles.dayDot, isSelected && styles.dayDotActive]}>
                    <Text style={styles.dayDotText}>{count}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Summary bar */}
      <View style={styles.summaryBar}>
        {[
          { label: 'Total', value: summary.total, color: Colors.textLight },
          { label: 'Active', value: summary.active, color: Colors.success },
          { label: 'Scheduled', value: summary.scheduled, color: Colors.info },
          { label: 'Done', value: summary.completed, color: Colors.textMuted },
        ].map((s, idx, arr) => (
          <React.Fragment key={s.label}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
            {idx < arr.length - 1 ? <View style={styles.summaryDiv} /> : null}
          </React.Fragment>
        ))}
      </View>

      {/* Type filter */}
      <View style={styles.filterOuter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {SHIFT_TYPES.map(type => (
            <Pressable
              key={type}
              onPress={() => setShiftType(type)}
              style={[styles.filterChip, shiftType === type && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, shiftType === type && styles.filterChipTextActive]}>{type}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={Colors.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ShiftCard shift={{
              id: item.id,
              employeeId: item.employee_id || '',
              employeeName: item.employee_name,
              date: item.date,
              startTime: item.start_time,
              endTime: item.end_time,
              type: item.type as any,
              site: item.site,
              role: item.role,
              status: item.status as any,
            }} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialIcons name="event-available" size={48} color={Colors.borderDark} />
              <Text style={styles.emptyTitle}>No Shifts</Text>
              <Text style={styles.emptySubtitle}>No shifts scheduled for this day</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dashboardBg },
  weekOuter: { height: 80, backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.borderCard },
  weekContent: {
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
  },
  dayBtn: {
    width: 56, height: 60, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.dashboardBg, gap: 2,
    borderWidth: 1, borderColor: Colors.borderCard,
  },
  dayBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  dayLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.medium, includeFontPadding: false },
  dayLabelActive: { color: Colors.textLight },
  dayNum: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  dayNumActive: { color: Colors.textLight },
  dayDot: {
    backgroundColor: Colors.accent + '30', borderRadius: BorderRadius.full,
    paddingHorizontal: 5, paddingVertical: 1,
  },
  dayDotActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  dayDotText: { fontSize: 9, color: Colors.textLight, fontWeight: FontWeight.bold, includeFontPadding: false },
  summaryBar: {
    flexDirection: 'row', backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    alignItems: 'center', justifyContent: 'space-around',
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryNum: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textLight, includeFontPadding: false },
  summaryLabel: { fontSize: FontSize.xs, color: '#888', includeFontPadding: false },
  summaryDiv: { width: 1, height: 24, backgroundColor: Colors.borderDark },
  filterOuter: { height: 52, backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.borderCard },
  filterContent: {
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: BorderRadius.full,
    backgroundColor: Colors.dashboardBg, borderWidth: 1, borderColor: Colors.borderCard,
    height: 32, justifyContent: 'center',
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  filterChipTextActive: { color: Colors.textLight, fontWeight: FontWeight.semibold },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  empty: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textSecondary, includeFontPadding: false },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, includeFontPadding: false },
});
