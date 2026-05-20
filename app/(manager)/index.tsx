// Manager Dashboard
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { useLeaveRequests } from '@/hooks/useLeaveRequests';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <View style={[statStyles.card, { borderTopColor: color }]}>
      <View style={[statStyles.iconWrap, { backgroundColor: color + '18' }]}>
        <MaterialIcons name={icon as any} size={22} color={color} />
      </View>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}
const statStyles = StyleSheet.create({
  card: { flex: 1, minWidth: '44%', backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.xs, borderTopWidth: 3, ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  label: { fontSize: FontSize.xs, color: Colors.textSecondary, includeFontPadding: false },
});

export default function ManagerDashboard() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { stats, sites, todayShifts, loading, refetch } = useDashboard();
  const { pending: pendingLeaves } = useLeaveRequests();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => { setRefreshing(true); await refetch(); setRefreshing(false); };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Manager Dashboard</Text>
          <Text style={styles.headerName}>{user?.name}</Text>
        </View>
        <Pressable onPress={logout} hitSlop={8} style={styles.logoutBtn}>
          <MaterialIcons name="logout" size={20} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Pending approvals banner */}
        {pendingLeaves.length > 0 ? (
          <View style={styles.alertBanner}>
            <MaterialIcons name="notification-important" size={18} color={Colors.warning} />
            <Text style={styles.alertText}>{pendingLeaves.length} pending leave request{pendingLeaves.length > 1 ? 's' : ''} awaiting your approval</Text>
            <MaterialIcons name="chevron-right" size={18} color={Colors.warning} />
          </View>
        ) : null}

        {/* Stats grid */}
        {loading || !stats ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} /> : (
          <>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <View style={styles.statsGrid}>
              <StatCard label="Total Staff" value={stats.totalEmployees} icon="people" color={Colors.primary} />
              <StatCard label="Clocked In" value={stats.presentToday} icon="login" color={Colors.success} />
              <StatCard label="Absent" value={stats.absentToday} icon="person-off" color={Colors.danger} />
              <StatCard label="Shifts Today" value={stats.shiftsToday} icon="calendar-today" color={Colors.info} />
              <StatCard label="Late" value={stats.lateToday} icon="schedule" color={Colors.warning} />
              <StatCard label="OT Hours (wk)" value={`${stats.overtimeHoursThisWeek}h`} icon="bolt" color={Colors.shiftOvertime} />
            </View>

            {/* Attendance bar */}
            <View style={styles.attCard}>
              <View style={styles.attTop}>
                <Text style={styles.attLabel}>Team Attendance Rate</Text>
                <Text style={[styles.attPct, { color: stats.attendanceRate >= 90 ? Colors.success : stats.attendanceRate >= 75 ? Colors.warning : Colors.danger }]}>
                  {stats.attendanceRate}%
                </Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, {
                  width: `${stats.attendanceRate}%` as any,
                  backgroundColor: stats.attendanceRate >= 90 ? Colors.success : stats.attendanceRate >= 75 ? Colors.warning : Colors.danger,
                }]} />
              </View>
            </View>
          </>
        )}

        {/* Sites */}
        {sites.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Active Sites</Text>
            {sites.map(site => (
              <View key={site.id} style={styles.siteCard}>
                <View style={styles.siteLeft}>
                  <View style={styles.siteIcon}>
                    <MaterialIcons name="factory" size={20} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.siteName}>{site.name}</Text>
                    <Text style={styles.siteLoc}>{site.location}</Text>
                  </View>
                </View>
                <View style={styles.siteRight}>
                  <Text style={styles.siteWorkers}>{site.active_workers}/{site.total_workers}</Text>
                  <Text style={styles.siteWorkersLbl}>workers</Text>
                </View>
              </View>
            ))}
          </>
        ) : null}

        {/* Today's shifts */}
        {todayShifts.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Today's Shifts ({todayShifts.length})</Text>
            {todayShifts.slice(0, 5).map(s => (
              <View key={s.id} style={styles.shiftRow}>
                <View style={[styles.shiftTypeDot, {
                  backgroundColor: s.type === 'morning' ? Colors.shiftMorning : s.type === 'night' ? Colors.shiftNight : s.type === 'overtime' ? Colors.shiftOvertime : Colors.shiftEvening
                }]} />
                <View style={styles.shiftInfo}>
                  <Text style={styles.shiftName}>{s.employee_name}</Text>
                  <Text style={styles.shiftMeta}>{s.start_time}–{s.end_time} · {s.site}</Text>
                </View>
                <View style={[styles.shiftStatus, { backgroundColor: s.status === 'active' ? Colors.successLight : Colors.surfaceAlt }]}>
                  <Text style={[styles.shiftStatusText, { color: s.status === 'active' ? Colors.success : Colors.textSecondary }]}>
                    {s.status}
                  </Text>
                </View>
              </View>
            ))}
          </>
        ) : null}

        <View style={{ height: 24 }} />
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
  headerSub: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.5, includeFontPadding: false },
  headerName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  logoutBtn: { padding: Spacing.xs },
  scroll: { padding: Spacing.md, gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.warningLight, borderRadius: BorderRadius.md,
    padding: Spacing.md, borderLeftWidth: 3, borderLeftColor: Colors.warning,
  },
  alertText: { flex: 1, fontSize: FontSize.sm, color: '#B45309', fontWeight: FontWeight.medium, includeFontPadding: false },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  attCard: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  attTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  attLabel: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  attPct: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, includeFontPadding: false },
  progressBg: { height: 8, backgroundColor: Colors.border, borderRadius: BorderRadius.full, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: BorderRadius.full },
  siteCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  siteLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  siteIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryFaded, alignItems: 'center', justifyContent: 'center' },
  siteName: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  siteLoc: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  siteRight: { alignItems: 'flex-end' },
  siteWorkers: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  siteWorkersLbl: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  shiftRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.sm, padding: Spacing.sm + 4, borderWidth: 1, borderColor: Colors.border },
  shiftTypeDot: { width: 10, height: 10, borderRadius: 5 },
  shiftInfo: { flex: 1 },
  shiftName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  shiftMeta: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  shiftStatus: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  shiftStatusText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'capitalize', includeFontPadding: false },
});
