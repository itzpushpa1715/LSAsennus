import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlert } from '@/template';
import { useAuth } from '@/hooks/useAuth';
import { useAttendance } from '@/hooks/useAttendance';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import type { AttendanceRow } from '@/services/supabase/attendanceService';

export default function AttendanceScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [filter, setFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');

  const isEmployee = user?.role === 'employee';

  // Get the employee DB ID from the user's employeeId field
  // We'll use the employeeId (like LS-118) to look up in the attendance records
  const { records, myRecord, clockedIn, loading, clockIn, clockOut, refetch } = useAttendance(undefined);

  const handleClockIn = async () => {
    if (!user) return;
    // Find the employee record matching this user by name in attendance
    showAlert('Clock In', 'Confirming clock in at Meyer Turku...', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clock In',
        onPress: async () => {
          const err = await clockIn(user.name, 'Meyer Turku');
          if (err) {
            showAlert('Error', err);
          } else {
            showAlert('Clocked In', `Successfully clocked in at Meyer Turku`);
          }
        },
      },
    ]);
  };

  const handleClockOut = async () => {
    showAlert('Clock Out', `Confirm clock out?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clock Out',
        style: 'destructive',
        onPress: async () => {
          const err = await clockOut();
          if (err) {
            showAlert('Error', err);
          } else {
            showAlert('Clocked Out', 'Attendance has been recorded.');
          }
        },
      },
    ]);
  };

  const filtered = records.filter(a => filter === 'all' ? true : a.status === filter);

  const stats = {
    present: records.filter(a => a.status === 'present').length,
    absent: records.filter(a => a.status === 'absent').length,
    late: records.filter(a => a.status === 'late').length,
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScreenHeader title="Attendance" subtitle="Today" rightIcon="download" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Employee Clock Panel */}
        {isEmployee ? (
          <View style={styles.clockPanel}>
            <View style={styles.clockLeft}>
              <View style={[styles.clockDot, { backgroundColor: clockedIn ? Colors.success : Colors.textMuted }]} />
              <View>
                <Text style={styles.clockStatus}>{clockedIn ? 'Currently On Site' : 'Not Clocked In'}</Text>
                {clockedIn && myRecord?.clock_in ? (
                  <Text style={styles.clockTime}>Since {myRecord.clock_in} · {myRecord.site}</Text>
                ) : null}
              </View>
            </View>
            <Pressable
              onPress={clockedIn ? handleClockOut : handleClockIn}
              style={({ pressed }) => [
                styles.clockBtn,
                { backgroundColor: clockedIn ? Colors.error : Colors.success, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <MaterialIcons name={clockedIn ? 'logout' : 'login'} size={18} color="#fff" />
              <Text style={styles.clockBtnText}>{clockedIn ? 'Clock Out' : 'Clock In'}</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Present', value: stats.present, color: Colors.success, key: 'present' },
            { label: 'Late', value: stats.late, color: Colors.warning, key: 'late' },
            { label: 'Absent', value: stats.absent, color: Colors.error, key: 'absent' },
          ].map(s => (
            <Pressable
              key={s.key}
              onPress={() => setFilter(s.key as any)}
              style={[styles.statItem, filter === s.key && { borderBottomWidth: 2, borderBottomColor: s.color }]}
            >
              <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Filter */}
        <View style={styles.filterRow}>
          {(['all', 'present', 'late', 'absent'] as const).map(f => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={Colors.accent} />
          </View>
        ) : (
          <View style={styles.listWrap}>
            {filtered.map(record => <AttendanceRow key={record.id} record={record} />)}
            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <MaterialIcons name="event-available" size={40} color={Colors.borderDark} />
                <Text style={styles.emptyText}>No records</Text>
              </View>
            ) : null}
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

function AttendanceRow({ record }: { record: AttendanceRow }) {
  const initials = record.employee_name.split(' ').map(n => n[0]).slice(0, 2).join('');
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.avatar}>
        <Text style={rowStyles.avatarText}>{initials}</Text>
      </View>
      <View style={rowStyles.info}>
        <View style={rowStyles.topRow}>
          <Text style={rowStyles.name}>{record.employee_name}</Text>
          <StatusBadge variant={record.status as any} size="sm" />
        </View>
        <Text style={rowStyles.site}>{record.site}</Text>
        <View style={rowStyles.timeRow}>
          {record.clock_in ? (
            <View style={rowStyles.timeItem}>
              <MaterialIcons name="login" size={12} color={Colors.success} />
              <Text style={rowStyles.timeText}>In: {record.clock_in}</Text>
            </View>
          ) : null}
          {record.clock_out ? (
            <View style={rowStyles.timeItem}>
              <MaterialIcons name="logout" size={12} color={Colors.error} />
              <Text style={rowStyles.timeText}>Out: {record.clock_out}</Text>
            </View>
          ) : null}
          {record.total_hours > 0 ? (
            <View style={rowStyles.timeItem}>
              <MaterialIcons name="schedule" size={12} color={Colors.accent} />
              <Text style={rowStyles.timeText}>{Number(record.total_hours).toFixed(1)}h</Text>
            </View>
          ) : null}
          {record.overtime_hours > 0 ? (
            <View style={rowStyles.timeItem}>
              <MaterialIcons name="bolt" size={12} color={Colors.overtimeShift} />
              <Text style={[rowStyles.timeText, { color: Colors.overtimeShift }]}>+{record.overtime_hours}h OT</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.card, borderRadius: BorderRadius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderCard,
    marginBottom: Spacing.sm, ...Shadow.card,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.accent + '20', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.accent, includeFontPadding: false },
  info: { flex: 1, gap: 2 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  site: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: 4 },
  timeItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText: { fontSize: FontSize.xs, color: Colors.textSecondary, includeFontPadding: false },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dashboardBg },
  clockPanel: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.md,
  },
  clockLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  clockDot: { width: 12, height: 12, borderRadius: 6 },
  clockStatus: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textLight, includeFontPadding: false },
  clockTime: { fontSize: FontSize.xs, color: '#999', includeFontPadding: false },
  clockBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md,
  },
  clockBtnText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: '#fff', includeFontPadding: false },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.borderCard },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  statNum: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, includeFontPadding: false },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  filterRow: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.sm, flexWrap: 'wrap' },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: BorderRadius.full,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.borderCard,
  },
  filterChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  filterTextActive: { color: Colors.textLight, fontWeight: FontWeight.semibold },
  loadingWrap: { padding: Spacing.xl, alignItems: 'center' },
  listWrap: { paddingHorizontal: Spacing.md },
  empty: { alignItems: 'center', paddingTop: Spacing.xl, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, includeFontPadding: false },
});
