// Admin Dashboard
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { useLeaveRequests } from '@/hooks/useLeaveRequests';
import { useEmployees } from '@/hooks/useEmployees';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const KPI_CARDS = [
  { key: 'totalEmployees', label: 'Total Employees', icon: 'people', color: Colors.primary },
  { key: 'presentToday', label: 'Present Today', icon: 'login', color: Colors.success },
  { key: 'absentToday', label: 'Absent', icon: 'person-off', color: Colors.danger },
  { key: 'lateToday', label: 'Late', icon: 'schedule', color: Colors.warning },
  { key: 'shiftsToday', label: 'Shifts Today', icon: 'calendar-today', color: Colors.info },
  { key: 'overtimeHoursThisWeek', label: 'OT Hours (wk)', icon: 'bolt', color: Colors.shiftOvertime },
  { key: 'activeSites', label: 'Active Sites', icon: 'factory', color: Colors.success },
  { key: 'expiringDocs', label: 'Doc Alerts', icon: 'warning', color: Colors.danger },
] as const;

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { stats, loading, refetch } = useDashboard();
  const { pending: pendingLeaves } = useLeaveRequests();
  const { employees } = useEmployees();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => { setRefreshing(true); await refetch(); setRefreshing(false); };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerRole}>HR / Admin</Text>
          <Text style={styles.headerName}>{user?.name}</Text>
        </View>
        <Pressable onPress={logout} hitSlop={8}>
          <MaterialIcons name="logout" size={20} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Pending banner */}
        {pendingLeaves.length > 0 ? (
          <View style={styles.alertBanner}>
            <MaterialIcons name="notification-important" size={18} color={Colors.warning} />
            <Text style={styles.alertText}>{pendingLeaves.length} leave request{pendingLeaves.length > 1 ? 's' : ''} pending</Text>
          </View>
        ) : null}

        {/* Expiry alert */}
        {stats && stats.expiringDocs > 0 ? (
          <View style={[styles.alertBanner, { backgroundColor: Colors.dangerLight, borderLeftColor: Colors.danger }]}>
            <MaterialIcons name="warning" size={18} color={Colors.danger} />
            <Text style={[styles.alertText, { color: Colors.danger }]}>{stats.expiringDocs} compliance document{stats.expiringDocs > 1 ? 's' : ''} expired or expiring</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
        {loading || !stats ? <ActivityIndicator color={Colors.primary} /> : (
          <View style={styles.kpiGrid}>
            {KPI_CARDS.map(card => {
              const val = stats[card.key as keyof typeof stats];
              return (
                <View key={card.key} style={[styles.kpiCard, { borderTopColor: card.color }]}>
                  <View style={[styles.kpiIcon, { backgroundColor: card.color + '18' }]}>
                    <MaterialIcons name={card.icon as any} size={20} color={card.color} />
                  </View>
                  <Text style={styles.kpiValue}>{typeof val === 'number' && !Number.isInteger(val) ? val.toFixed(1) : val}{card.key === 'overtimeHoursThisWeek' ? 'h' : ''}</Text>
                  <Text style={styles.kpiLabel}>{card.label}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Attendance rate */}
        {stats ? (
          <View style={styles.attCard}>
            <View style={styles.attTop}>
              <Text style={styles.attLabel}>Company Attendance Rate</Text>
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
            <Text style={styles.attSub}>{stats.presentToday} present · {stats.lateToday} late · {stats.absentToday} absent out of {stats.totalEmployees}</Text>
          </View>
        ) : null}

        {/* Quick links */}
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <View style={styles.quickGrid}>
          {[
            { icon: 'people' as const, label: 'Employee Panel', sub: `${employees.length} employees` },
            { icon: 'bar-chart' as const, label: 'Revenue Tracker', sub: 'Financial overview' },
            { icon: 'schedule' as const, label: 'All Timesheets', sub: 'Review & approve' },
            { icon: 'settings' as const, label: 'Settings', sub: 'System configuration' },
          ].map(item => (
            <Pressable key={item.label} style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.8 }]}>
              <View style={styles.quickIcon}>
                <MaterialIcons name={item.icon} size={22} color={Colors.primary} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
              <Text style={styles.quickSub}>{item.sub}</Text>
            </Pressable>
          ))}
        </View>

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
  headerRole: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.5, includeFontPadding: false },
  headerName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  scroll: { padding: Spacing.md, gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.warningLight, borderRadius: BorderRadius.md,
    padding: Spacing.md, borderLeftWidth: 3, borderLeftColor: Colors.warning,
  },
  alertText: { flex: 1, fontSize: FontSize.sm, color: '#B45309', fontWeight: FontWeight.medium, includeFontPadding: false },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  kpiCard: {
    flex: 1, minWidth: '44%', backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    padding: Spacing.md, gap: Spacing.xs, borderTopWidth: 3, ...Shadow.card, borderWidth: 1, borderColor: Colors.border,
  },
  kpiIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  kpiValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  kpiLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, includeFontPadding: false },
  attCard: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  attTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  attLabel: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  attPct: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, includeFontPadding: false },
  progressBg: { height: 8, backgroundColor: Colors.border, borderRadius: BorderRadius.full, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: BorderRadius.full },
  attSub: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickCard: {
    flex: 1, minWidth: '44%', backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    padding: Spacing.md, gap: Spacing.xs, ...Shadow.card, borderWidth: 1, borderColor: Colors.border,
  },
  quickIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryFaded, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  quickSub: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
});
