// Employee shift calendar screen
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useShifts } from '@/hooks/useShifts';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const SHIFT_COLORS: Record<string, string> = {
  morning: Colors.shiftMorning,
  evening: Colors.shiftEvening,
  night: Colors.shiftNight,
  overtime: Colors.shiftOvertime,
  weekend: Colors.shiftWeekend,
  emergency: Colors.danger,
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { allShifts, loading, refetch } = useShifts();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayStr = today.toISOString().split('T')[0];

  // Build calendar days for month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();

  // Shifts map by date
  const shiftsByDate: Record<string, typeof allShifts> = {};
  allShifts.forEach(s => {
    if (!shiftsByDate[s.date]) shiftsByDate[s.date] = [];
    shiftsByDate[s.date].push(s);
  });

  const selectedShifts = selectedDate
    ? (shiftsByDate[selectedDate] || []).filter(s => !user?.employeeId || s.employee_id === user.employeeId)
    : [];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); }
    else setCurrentMonth(m => m + 1);
  };

  const buildDateStr = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Schedule</Text>
        <Pressable onPress={refetch} hitSlop={12}>
          <MaterialIcons name="refresh" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month nav */}
        <View style={styles.monthNav}>
          <Pressable onPress={prevMonth} hitSlop={12} style={styles.navBtn}>
            <MaterialIcons name="chevron-left" size={28} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.monthLabel}>{MONTHS[currentMonth]} {currentYear}</Text>
          <Pressable onPress={nextMonth} hitSlop={12} style={styles.navBtn}>
            <MaterialIcons name="chevron-right" size={28} color={Colors.textPrimary} />
          </Pressable>
        </View>

        {/* Day labels */}
        <View style={styles.dayLabels}>
          {DAYS.map(d => (
            <Text key={d} style={styles.dayLabel}>{d}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        {loading ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} /> : (
          <View style={styles.grid}>
            {/* Empty cells before month start */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.cell} />
            ))}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const dateStr = buildDateStr(day);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const isPast = dateStr < todayStr;
              const myDayShifts = (shiftsByDate[dateStr] || []).filter(s =>
                !user?.employeeId || s.employee_id === user.employeeId
              );
              const hasShift = myDayShifts.length > 0;

              return (
                <Pressable
                  key={dateStr}
                  onPress={() => setSelectedDate(isSelected ? null : dateStr)}
                  style={[
                    styles.cell,
                    isToday && styles.cellToday,
                    isSelected && styles.cellSelected,
                  ]}
                >
                  <Text style={[
                    styles.dayNum,
                    isToday && styles.dayNumToday,
                    isSelected && styles.dayNumSelected,
                    isPast && !isToday && styles.dayNumPast,
                  ]}>
                    {day}
                  </Text>
                  {hasShift ? (
                    <View style={styles.dotsRow}>
                      {myDayShifts.slice(0, 3).map(s => (
                        <View
                          key={s.id}
                          style={[styles.dot, { backgroundColor: isPast ? Colors.textMuted : SHIFT_COLORS[s.type] || Colors.primary }]}
                        />
                      ))}
                    </View>
                  ) : <View style={styles.dotsPlaceholder} />}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          {Object.entries(SHIFT_COLORS).map(([type, color]) => (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{type}</Text>
            </View>
          ))}
        </View>

        {/* Selected date detail */}
        {selectedDate ? (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
            {selectedShifts.length === 0 ? (
              <View style={styles.noShiftRow}>
                <MaterialIcons name="event-available" size={20} color={Colors.textMuted} />
                <Text style={styles.noShiftText}>No shift scheduled</Text>
              </View>
            ) : selectedShifts.map(s => (
              <View key={s.id} style={[styles.shiftDetail, { borderLeftColor: SHIFT_COLORS[s.type] || Colors.primary }]}>
                <View style={styles.shiftDetailRow}>
                  <MaterialIcons name="schedule" size={15} color={Colors.textSecondary} />
                  <Text style={styles.shiftDetailText}>{s.start_time} – {s.end_time}</Text>
                  <View style={[styles.typeTag, { backgroundColor: SHIFT_COLORS[s.type] + '20' }]}>
                    <Text style={[styles.typeTagText, { color: SHIFT_COLORS[s.type] }]}>{s.type}</Text>
                  </View>
                </View>
                <View style={styles.shiftDetailRow}>
                  <MaterialIcons name="location-on" size={15} color={Colors.textSecondary} />
                  <Text style={styles.shiftDetailText}>{s.site}</Text>
                </View>
                <View style={styles.shiftDetailRow}>
                  <MaterialIcons name="work" size={15} color={Colors.textSecondary} />
                  <Text style={styles.shiftDetailText}>{s.role}</Text>
                </View>
                {s.status === 'cancelled' ? (
                  <View style={styles.cancelledBadge}>
                    <Text style={styles.cancelledText}>CANCELLED</Text>
                  </View>
                ) : null}
                {s.notes ? (
                  <Text style={styles.shiftNotes}>{s.notes}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  navBtn: { padding: 4 },
  monthLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  dayLabels: { flexDirection: 'row', paddingHorizontal: Spacing.sm },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textMuted, paddingVertical: Spacing.xs, includeFontPadding: false },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.sm },
  cell: { width: `${100 / 7}%` as any, alignItems: 'center', paddingVertical: Spacing.xs, minHeight: 52, gap: 2 },
  cellToday: { backgroundColor: Colors.primaryFaded, borderRadius: BorderRadius.sm },
  cellSelected: { backgroundColor: Colors.primary + '15', borderRadius: BorderRadius.sm },
  dayNum: { fontSize: FontSize.body, fontWeight: FontWeight.medium, color: Colors.textPrimary, includeFontPadding: false },
  dayNumToday: { color: Colors.primary, fontWeight: FontWeight.bold },
  dayNumSelected: { color: Colors.primary, fontWeight: FontWeight.bold },
  dayNumPast: { color: Colors.textMuted },
  dotsRow: { flexDirection: 'row', gap: 2 },
  dotsPlaceholder: { height: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FontSize.xs, color: Colors.textSecondary, textTransform: 'capitalize', includeFontPadding: false },
  detailCard: {
    margin: Spacing.md, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    padding: Spacing.md, gap: Spacing.sm, ...Shadow.card, borderWidth: 1, borderColor: Colors.border,
  },
  detailTitle: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  noShiftRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  noShiftText: { fontSize: FontSize.body, color: Colors.textMuted, includeFontPadding: false },
  shiftDetail: { borderLeftWidth: 3, paddingLeft: Spacing.sm, gap: 6 },
  shiftDetailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  shiftDetailText: { fontSize: FontSize.sm, color: Colors.textPrimary, flex: 1, includeFontPadding: false },
  typeTag: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  typeTagText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'capitalize', includeFontPadding: false },
  cancelledBadge: { backgroundColor: Colors.dangerLight, borderRadius: BorderRadius.xs, paddingHorizontal: Spacing.sm, paddingVertical: 2, alignSelf: 'flex-start' },
  cancelledText: { fontSize: FontSize.xs, color: Colors.danger, fontWeight: FontWeight.bold, includeFontPadding: false },
  shiftNotes: { fontSize: FontSize.sm, color: Colors.textSecondary, fontStyle: 'italic', includeFontPadding: false },
});
