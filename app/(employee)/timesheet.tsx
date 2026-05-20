// Timesheet screen (employee)
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAttendance } from '@/hooks/useAttendance';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const TABS = ['This Week', 'This Month', 'History'] as const;
type Tab = (typeof TABS)[number];

const STATUS_COLORS = {
  present: { bg: Colors.successLight, text: Colors.success, label: 'APPROVED' },
  late: { bg: Colors.warningLight, text: Colors.warning, label: 'LATE' },
  absent: { bg: Colors.dangerLight, text: Colors.danger, label: 'ABSENT' },
  'half-day': { bg: Colors.infoLight, text: Colors.info, label: 'HALF-DAY' },
};

export default function TimesheetScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('This Week');
  const { records, loading } = useAttendance();

  const totalHours = records.reduce((s, r) => s + (r.total_hours || 0), 0);
  const totalOT = records.reduce((s, r) => s + (r.overtime_hours || 0), 0);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timesheet</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalHours.toFixed(1)}h</Text>
          <Text style={styles.summaryLabel}>Total Hours</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: Colors.warning }]}>{totalOT.toFixed(1)}h</Text>
          <Text style={styles.summaryLabel}>Overtime</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: Colors.primary }]}>{records.length}</Text>
          <Text style={styles.summaryLabel}>Days Recorded</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        {TABS.map(t => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={records}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialIcons name="schedule" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No timesheet records</Text>
            </View>
          }
          renderItem={({ item }) => {
            const st = STATUS_COLORS[item.status] || STATUS_COLORS.present;
            return (
              <View style={styles.entryCard}>
                <View style={styles.entryLeft}>
                  <Text style={styles.entryDate}>{new Date(item.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
                  <Text style={styles.entrySite}>{item.site}</Text>
                  {item.clock_in && item.clock_out ? (
                    <Text style={styles.entryTimes}>{item.clock_in} – {item.clock_out}</Text>
                  ) : item.clock_in ? (
                    <Text style={styles.entryTimes}>In: {item.clock_in}</Text>
                  ) : null}
                </View>
                <View style={styles.entryRight}>
                  <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                    <Text style={[styles.statusText, { color: st.text }]}>{st.label}</Text>
                  </View>
                  <Text style={styles.entryHours}>{(item.total_hours || 0).toFixed(1)}h</Text>
                  {(item.overtime_hours || 0) > 0 ? (
                    <Text style={styles.entryOT}>+{(item.overtime_hours || 0).toFixed(1)}h OT</Text>
                  ) : null}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  summaryRow: {
    flexDirection: 'row', backgroundColor: Colors.cardBg,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  summaryLabel: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  summaryDivider: { width: 1, backgroundColor: Colors.border },
  tabBar: { flexDirection: 'row', backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, paddingVertical: Spacing.sm + 4, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textMuted, includeFontPadding: false },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  list: { padding: Spacing.md, gap: Spacing.sm },
  entryCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    padding: Spacing.md, ...Shadow.card, borderWidth: 1, borderColor: Colors.border,
  },
  entryLeft: { gap: 2 },
  entryDate: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  entrySite: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  entryTimes: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  entryRight: { alignItems: 'flex-end', gap: 4 },
  statusBadge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, includeFontPadding: false },
  entryHours: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  entryOT: { fontSize: FontSize.xs, color: Colors.warning, fontWeight: FontWeight.semibold, includeFontPadding: false },
  empty: { alignItems: 'center', paddingTop: 64, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.body, color: Colors.textSecondary, includeFontPadding: false },
});
