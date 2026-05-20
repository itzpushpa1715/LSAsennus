// Employee Home Dashboard
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { useAttendance } from '@/hooks/useAttendance';
import { useShifts } from '@/hooks/useShifts';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const QUICK_ACTIONS = [
  { icon: 'calendar-month' as const, label: 'My Schedule', route: '/(employee)/calendar' as const },
  { icon: 'beach-access' as const, label: 'Request Leave', route: '/(employee)/leave' as const },
  { icon: 'swap-horiz' as const, label: 'Swap Shift', route: '/(employee)/shift-swap' as const },
  { icon: 'chat-bubble-outline' as const, label: 'Messages', route: '/(employee)/messages' as const },
];

export default function EmployeeHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { todayShifts, loading: dashLoading, refetch: refetchDash } = useDashboard();
  const { myRecord, clockedIn, loading: attLoading } = useAttendance(user?.employeeId || undefined);
  const { allShifts, weekDates } = useShifts();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetchDash();
    setRefreshing(false);
  };

  // Today's shift for this employee
  const today = new Date().toISOString().split('T')[0];
  const myTodayShift = todayShifts.find(s => s.employee_id === user?.employeeId) || null;
  const upcomingShifts = allShifts
    .filter(s => s.date > today && (!user?.employeeId || s.employee_id === user.employeeId))
    .slice(0, 3);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.name}>{user?.name ?? 'Employee'}</Text>
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
        {/* Today's shift card */}
        <View style={[styles.shiftCard, myTodayShift ? styles.shiftCardActive : styles.shiftCardEmpty]}>
          {myTodayShift ? (
            <>
              <View style={styles.shiftCardTop}>
                <View style={styles.shiftChip}>
                  <Text style={styles.shiftChipText}>{myTodayShift.type.toUpperCase()}</Text>
                </View>
                <Text style={styles.shiftSite}>{myTodayShift.site}</Text>
              </View>
              <View style={styles.shiftTimes}>
                <View style={styles.shiftTimeItem}>
                  <MaterialIcons name="schedule" size={16} color={Colors.textInverse} />
                  <Text style={styles.shiftTimeText}>{myTodayShift.start_time} – {myTodayShift.end_time}</Text>
                </View>
                <View style={styles.shiftTimeItem}>
                  <MaterialIcons name="work" size={16} color={Colors.textInverse} />
                  <Text style={styles.shiftTimeText}>{myTodayShift.role}</Text>
                </View>
              </View>
              {/* Clock status */}
              <View style={styles.clockStatus}>
                <View style={[styles.clockDot, { backgroundColor: clockedIn ? Colors.clockIn : Colors.clockOut }]} />
                <Text style={styles.clockStatusText}>
                  {clockedIn ? `Clocked In${myRecord?.clock_in ? ' at ' + myRecord.clock_in : ''}` : 'Not Clocked In'}
                </Text>
                <Pressable onPress={() => router.push('/(employee)/clock')} style={styles.clockLink}>
                  <Text style={styles.clockLinkText}>Go to Clock</Text>
                  <MaterialIcons name="chevron-right" size={16} color={Colors.textInverse} />
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.noShift}>
              <MaterialIcons name="event-busy" size={32} color={Colors.textMuted} />
              <Text style={styles.noShiftTitle}>No shift scheduled today</Text>
              <Text style={styles.noShiftSub}>Check your schedule for upcoming shifts</Text>
            </View>
          )}
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map(a => (
            <Pressable
              key={a.label}
              onPress={() => router.push(a.route as any)}
              style={({ pressed }) => [styles.quickBtn, pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] }]}
            >
              <View style={styles.quickIcon}>
                <MaterialIcons name={a.icon} size={22} color={Colors.primary} />
              </View>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Upcoming shifts */}
        {upcomingShifts.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Upcoming Shifts</Text>
            {upcomingShifts.map(s => (
              <View key={s.id} style={styles.upcomingCard}>
                <View style={[styles.upcomingBar, { backgroundColor: s.type === 'morning' ? Colors.shiftMorning : s.type === 'night' ? Colors.shiftNight : Colors.shiftEvening }]} />
                <View style={styles.upcomingContent}>
                  <Text style={styles.upcomingDate}>{new Date(s.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
                  <Text style={styles.upcomingTime}>{s.start_time} – {s.end_time}</Text>
                  <Text style={styles.upcomingSite}>{s.site}  ·  {s.role}</Text>
                </View>
                <View style={[styles.typeChip, { backgroundColor: s.type === 'morning' ? Colors.shiftMorning + '20' : s.type === 'night' ? Colors.shiftNight + '20' : Colors.shiftEvening + '20' }]}>
                  <Text style={[styles.typeChipText, { color: s.type === 'morning' ? Colors.shiftMorning : s.type === 'night' ? Colors.shiftNight : Colors.shiftEvening }]}>{s.type}</Text>
                </View>
              </View>
            ))}
          </>
        ) : null}

        {dashLoading ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} /> : null}
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
  greeting: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  name: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  logoutBtn: { padding: Spacing.xs },
  scroll: { padding: Spacing.md, gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },

  // Shift card
  shiftCard: { borderRadius: BorderRadius.lg, padding: Spacing.md, gap: Spacing.sm, ...Shadow.panel },
  shiftCardActive: { backgroundColor: Colors.primary },
  shiftCardEmpty: { backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border },
  shiftCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shiftChip: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  shiftChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
  shiftSite: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', fontWeight: FontWeight.medium, includeFontPadding: false },
  shiftTimes: { flexDirection: 'row', gap: Spacing.md },
  shiftTimeItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  shiftTimeText: { fontSize: FontSize.sm, color: Colors.textInverse, fontWeight: FontWeight.medium, includeFontPadding: false },
  clockStatus: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.sm, padding: Spacing.sm },
  clockDot: { width: 8, height: 8, borderRadius: 4 },
  clockStatusText: { flex: 1, fontSize: FontSize.sm, color: Colors.textInverse, includeFontPadding: false },
  clockLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  clockLinkText: { fontSize: FontSize.xs, color: Colors.textInverse, fontWeight: FontWeight.semibold, includeFontPadding: false },
  noShift: { alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.md },
  noShiftTitle: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  noShiftSub: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },

  // Quick actions
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickBtn: {
    flex: 1, minWidth: '40%', backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', gap: Spacing.xs,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.card,
  },
  quickIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryFaded, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center', includeFontPadding: false },

  // Upcoming
  upcomingCard: {
    flexDirection: 'row', backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    overflow: 'hidden', ...Shadow.card, borderWidth: 1, borderColor: Colors.border,
  },
  upcomingBar: { width: 4 },
  upcomingContent: { flex: 1, padding: Spacing.md, gap: 2 },
  upcomingDate: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  upcomingTime: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  upcomingSite: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  typeChip: { margin: Spacing.md, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 4, alignSelf: 'center', justifyContent: 'center' },
  typeChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'capitalize', includeFontPadding: false },
});
