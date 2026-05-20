// Manager schedule builder
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useShifts } from '@/hooks/useShifts';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const SHIFT_COLORS: Record<string, string> = {
  morning: Colors.shiftMorning, evening: Colors.shiftEvening, night: Colors.shiftNight,
  overtime: Colors.shiftOvertime, weekend: Colors.shiftWeekend, emergency: Colors.danger,
};

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { allShifts, weekDates, loading, refetch } = useShifts();
  const [selectedDate, setSelectedDate] = useState(weekDates[0] || new Date().toISOString().split('T')[0]);

  const todayStr = new Date().toISOString().split('T')[0];
  const dayShifts = allShifts.filter(s => s.date === selectedDate);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule Builder</Text>
        <Pressable onPress={refetch} hitSlop={12}>
          <MaterialIcons name="refresh" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Week strip */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekStrip}>
        {weekDates.map(date => {
          const d = new Date(date + 'T12:00:00');
          const isToday = date === todayStr;
          const isSelected = date === selectedDate;
          const shiftsCount = allShifts.filter(s => s.date === date).length;
          return (
            <Pressable
              key={date}
              onPress={() => setSelectedDate(date)}
              style={[styles.dayPill, isSelected && styles.dayPillActive, isToday && !isSelected && styles.dayPillToday]}
            >
              <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
                {d.toLocaleDateString('en-GB', { weekday: 'short' })}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>{d.getDate()}</Text>
              {shiftsCount > 0 ? (
                <View style={[styles.shiftCount, { backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : Colors.primaryFaded }]}>
                  <Text style={[styles.shiftCountText, { color: isSelected ? Colors.textInverse : Colors.primary }]}>{shiftsCount}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Day header */}
      <View style={styles.dayHeader}>
        <Text style={styles.dayHeaderTitle}>
          {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        <Text style={styles.dayHeaderCount}>{dayShifts.length} shift{dayShifts.length !== 1 ? 's' : ''}</Text>
      </View>

      {loading ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} /> : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {dayShifts.length === 0 ? (
            <View style={styles.empty}>
              <MaterialIcons name="event-note" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No shifts scheduled</Text>
              <Text style={styles.emptySub}>This day has no shifts yet</Text>
            </View>
          ) : dayShifts.map(s => (
            <View key={s.id} style={styles.shiftCard}>
              <View style={[styles.shiftBar, { backgroundColor: SHIFT_COLORS[s.type] || Colors.primary }]} />
              <View style={styles.shiftContent}>
                <View style={styles.shiftTop}>
                  <Text style={styles.shiftName}>{s.employee_name}</Text>
                  <View style={[styles.typeBadge, { backgroundColor: (SHIFT_COLORS[s.type] || Colors.primary) + '20' }]}>
                    <Text style={[styles.typeBadgeText, { color: SHIFT_COLORS[s.type] || Colors.primary }]}>{s.type}</Text>
                  </View>
                </View>
                <View style={styles.shiftMeta}>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="schedule" size={13} color={Colors.textMuted} />
                    <Text style={styles.metaText}>{s.start_time} – {s.end_time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="location-on" size={13} color={Colors.textMuted} />
                    <Text style={styles.metaText}>{s.site}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="work" size={13} color={Colors.textMuted} />
                    <Text style={styles.metaText}>{s.role}</Text>
                  </View>
                </View>
                <View style={[styles.statusChip, {
                  backgroundColor: s.status === 'active' ? Colors.successLight : s.status === 'completed' ? Colors.surfaceAlt : s.status === 'missed' ? Colors.dangerLight : Colors.infoLight
                }]}>
                  <Text style={[styles.statusChipText, {
                    color: s.status === 'active' ? Colors.success : s.status === 'completed' ? Colors.textSecondary : s.status === 'missed' ? Colors.danger : Colors.info
                  }]}>{s.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  weekStrip: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm, backgroundColor: Colors.cardBg },
  dayPill: { alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, minWidth: 52, gap: 4, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },
  dayPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayPillToday: { borderColor: Colors.primary, backgroundColor: Colors.primaryFaded },
  dayName: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textMuted, includeFontPadding: false },
  dayNameActive: { color: Colors.textInverse },
  dayNum: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  dayNumActive: { color: Colors.textInverse },
  shiftCount: { borderRadius: BorderRadius.full, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  shiftCountText: { fontSize: 10, fontWeight: FontWeight.bold, includeFontPadding: false },
  dayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  dayHeaderTitle: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  dayHeaderCount: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  scroll: { padding: Spacing.md, gap: Spacing.sm },
  shiftCard: { flexDirection: 'row', backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, overflow: 'hidden', ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  shiftBar: { width: 4 },
  shiftContent: { flex: 1, padding: Spacing.md, gap: Spacing.sm },
  shiftTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shiftName: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  typeBadge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  typeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'capitalize', includeFontPadding: false },
  shiftMeta: { gap: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  statusChip: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3, alignSelf: 'flex-start' },
  statusChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, includeFontPadding: false },
  empty: { alignItems: 'center', paddingTop: 64, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  emptySub: { fontSize: FontSize.body, color: Colors.textSecondary, includeFontPadding: false },
});
