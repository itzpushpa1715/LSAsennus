import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { StatCard } from '@/components/ui/StatCard';
import { ShiftCard } from '@/components/feature/ShiftCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { stats, sites, todayShifts, loading, refetch } = useDashboard();
  const [showLogout, setShowLogout] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isSupervisor = user?.role === 'supervisor' || isAdmin;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <Pressable
          onPress={() => setShowLogout(v => !v)}
          style={({ pressed }) => [styles.avatarBtn, pressed && { opacity: 0.8 }]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'US'}
            </Text>
          </View>
        </Pressable>
        {showLogout ? (
          <View style={styles.logoutMenu}>
            <Text style={styles.logoutMenuId}>{user?.role}</Text>
            <Text style={styles.logoutMenuEmail}>{user?.email}</Text>
            <Pressable onPress={logout} style={styles.logoutBtn}>
              <MaterialIcons name="logout" size={16} color={Colors.error} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        onScrollBeginDrag={() => setShowLogout(false)}
      >
        {/* Date strip */}
        <View style={styles.dateStrip}>
          <MaterialIcons name="today" size={14} color={Colors.textMuted} />
          <Text style={styles.dateText}>Monday, 19 May 2026</Text>
          {stats ? (
            <>
              <View style={styles.dateDivider} />
              <Text style={styles.siteCount}>{stats.activeSites} Active Sites</Text>
            </>
          ) : null}
        </View>

        {/* Alert banner */}
        {stats && stats.expiringDocs > 0 ? (
          <Pressable style={styles.alertBanner}>
            <MaterialIcons name="warning" size={16} color={Colors.warning} />
            <Text style={styles.alertText}>
              {stats.expiringDocs} document{stats.expiringDocs > 1 ? 's' : ''} expiring or expired — review required
            </Text>
            <MaterialIcons name="chevron-right" size={16} color={Colors.warning} />
          </Pressable>
        ) : null}

        {/* Stats */}
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        {loading || !stats ? (
          <ActivityIndicator color={Colors.accent} />
        ) : (
          <View style={styles.statsGrid}>
            <StatCard label="Total Workers" value={stats.totalEmployees} icon="people" color={Colors.accent} />
            <StatCard label="On Site Now" value={stats.presentToday} icon="location-on" color={Colors.success} />
            <StatCard label="Absent Today" value={stats.absentToday} icon="person-off" color={Colors.error} />
            <StatCard label="Late Arrivals" value={stats.lateToday} icon="schedule" color={Colors.warning} />
            <StatCard label="Shifts Today" value={stats.shiftsToday} icon="calendar-today" color={Colors.nightShift} />
            <StatCard label="OT Hours (week)" value={`${stats.overtimeHoursThisWeek}h`} icon="bolt" color={Colors.overtimeShift} />
          </View>
        )}

        {/* Attendance bar */}
        {stats ? (
          <View style={styles.attendanceCard}>
            <View style={styles.attendanceTop}>
              <Text style={styles.attendanceLabel}>Attendance Rate</Text>
              <Text style={styles.attendanceValue}>{stats.attendanceRate}%</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${stats.attendanceRate}%` as any }]} />
            </View>
            <View style={styles.attendanceLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.legendText}>Present {stats.presentToday}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
                <Text style={styles.legendText}>Late {stats.lateToday}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
                <Text style={styles.legendText}>Absent {stats.absentToday}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Active Sites */}
        {isSupervisor && sites.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Active Sites</Text>
            {sites.map(site => (
              <View key={site.id} style={styles.siteCard}>
                <View style={styles.siteLeft}>
                  <View style={styles.siteIconWrap}>
                    <MaterialIcons name="factory" size={20} color={Colors.accent} />
                  </View>
                  <View>
                    <Text style={styles.siteName}>{site.name}</Text>
                    <Text style={styles.siteLocation}>{site.location}</Text>
                  </View>
                </View>
                <View style={styles.siteRight}>
                  <Text style={styles.siteWorkers}>{site.active_workers}/{site.total_workers}</Text>
                  <Text style={styles.siteWorkersLabel}>workers</Text>
                  <StatusBadge variant="active" label={site.current_shift} size="sm" />
                </View>
              </View>
            ))}
          </>
        ) : null}

        {/* Today's Shifts */}
        {todayShifts.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Today's Shifts</Text>
            {todayShifts.map(shift => (
              <ShiftCard key={shift.id} shift={{
                id: shift.id,
                employeeId: shift.employee_id || '',
                employeeName: shift.employee_name,
                date: shift.date,
                startTime: shift.start_time,
                endTime: shift.end_time,
                type: shift.type as any,
                site: shift.site,
                role: shift.role,
                status: shift.status as any,
              }} />
            ))}
          </>
        ) : null}

        {/* Pending leaves banner */}
        {isAdmin && stats && stats.pendingLeaves > 0 ? (
          <View style={styles.pendingBanner}>
            <MaterialIcons name="event-busy" size={18} color={Colors.info} />
            <Text style={styles.pendingText}>{stats.pendingLeaves} leave request{stats.pendingLeaves > 1 ? 's' : ''} awaiting approval</Text>
          </View>
        ) : null}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dashboardBg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderCard,
    position: 'relative',
    zIndex: 10,
  },
  greeting: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  userName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  avatarBtn: {},
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent + '22',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.accent + '55',
  },
  avatarText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.accent, includeFontPadding: false },
  logoutMenu: {
    position: 'absolute', right: Spacing.md, top: 56,
    backgroundColor: Colors.card, borderRadius: BorderRadius.md,
    padding: Spacing.md, ...Shadow.panel,
    borderWidth: 1, borderColor: Colors.borderCard, zIndex: 100, minWidth: 200,
  },
  logoutMenuId: {
    fontSize: FontSize.xs, color: Colors.accent,
    fontWeight: FontWeight.semibold, textTransform: 'capitalize', includeFontPadding: false,
  },
  logoutMenuEmail: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.sm, includeFontPadding: false },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingTop: Spacing.xs },
  logoutText: { fontSize: FontSize.body, color: Colors.error, fontWeight: FontWeight.medium, includeFontPadding: false },
  scroll: { padding: Spacing.md, gap: Spacing.md },
  dateStrip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  dateText: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  dateDivider: { width: 1, height: 12, backgroundColor: Colors.borderDark, marginHorizontal: 4 },
  siteCount: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: FontWeight.medium, includeFontPadding: false },
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.warningLight, borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderLeftWidth: 3, borderLeftColor: Colors.warning,
  },
  alertText: { flex: 1, fontSize: FontSize.sm, color: '#E65100', includeFontPadding: false },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  attendanceCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.md,
    padding: Spacing.md, gap: Spacing.sm, ...Shadow.card,
    borderWidth: 1, borderColor: Colors.borderCard,
  },
  attendanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  attendanceLabel: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  attendanceValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.success, includeFontPadding: false },
  progressBg: { height: 8, backgroundColor: Colors.borderCard, borderRadius: BorderRadius.full, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: Colors.success, borderRadius: BorderRadius.full },
  attendanceLegend: { flexDirection: 'row', gap: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FontSize.xs, color: Colors.textSecondary, includeFontPadding: false },
  siteCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.md,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', ...Shadow.card,
    borderWidth: 1, borderColor: Colors.borderCard,
  },
  siteLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  siteIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent + '15', alignItems: 'center', justifyContent: 'center',
  },
  siteName: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  siteLocation: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  siteRight: { alignItems: 'flex-end', gap: 2 },
  siteWorkers: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  siteWorkersLabel: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  pendingBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.infoLight, borderRadius: BorderRadius.md,
    padding: Spacing.md, borderLeftWidth: 3, borderLeftColor: Colors.info,
  },
  pendingText: { flex: 1, fontSize: FontSize.sm, color: '#1565C0', includeFontPadding: false },
});
