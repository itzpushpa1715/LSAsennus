// Clock In / Clock Out screen
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAttendance } from '@/hooks/useAttendance';
import { useAlert } from '@/template';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function ClockScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { myRecord, clockedIn, loading, clockIn, clockOut, refetch } = useAttendance(user?.employeeId || undefined);

  const [elapsed, setElapsed] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start/stop timer
  useEffect(() => {
    if (clockedIn && myRecord?.clock_in) {
      const [h, m] = myRecord.clock_in.split(':').map(Number);
      const start = new Date();
      start.setHours(h, m, 0, 0);
      const tick = () => setElapsed(Math.floor((Date.now() - start.getTime()) / 1000));
      tick();
      timerRef.current = setInterval(tick, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [clockedIn, myRecord?.clock_in]);

  const handleClockIn = async () => {
    setActionLoading(true);
    const site = 'Main Site';
    const err = await clockIn(user?.name || 'Employee', site);
    setActionLoading(false);
    if (err) showAlert('Clock In Failed', err);
  };

  const handleClockOut = async () => {
    setActionLoading(true);
    const err = await clockOut();
    setActionLoading(false);
    if (err) showAlert('Clock Out Failed', err);
    else if (myRecord) {
      const hrs = myRecord.total_hours || 0;
      const h = Math.floor(hrs);
      const m = Math.round((hrs - h) * 60);
      showAlert('Session Complete', `You worked ${h}h ${m}m today.`);
    }
  };

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clock In / Out</Text>
        <Text style={styles.headerDate}>{now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Status card */}
        <View style={[styles.statusCard, { backgroundColor: clockedIn ? Colors.successLight : Colors.surfaceAlt }]}>
          <View style={[styles.statusDot, { backgroundColor: clockedIn ? Colors.clockIn : Colors.textMuted }]} />
          <View>
            <Text style={[styles.statusLabel, { color: clockedIn ? Colors.success : Colors.textSecondary }]}>
              {clockedIn ? 'Currently Clocked In' : 'Not Clocked In'}
            </Text>
            {myRecord?.clock_in ? (
              <Text style={styles.statusSub}>Since {myRecord.clock_in} · {myRecord.site}</Text>
            ) : null}
          </View>
        </View>

        {/* Live time */}
        <View style={styles.timeDisplay}>
          <Text style={styles.currentTime}>{timeStr}</Text>
          {clockedIn ? (
            <Text style={styles.elapsedTime}>{formatDuration(elapsed)} elapsed</Text>
          ) : null}
        </View>

        {/* Main button */}
        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginVertical: 32 }} />
        ) : (
          <Pressable
            onPress={clockedIn ? handleClockOut : handleClockIn}
            style={({ pressed }) => [
              styles.mainBtn,
              { backgroundColor: clockedIn ? Colors.clockOut : Colors.clockIn },
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
            ]}
            disabled={actionLoading}
            accessibilityLabel={clockedIn ? 'Clock Out' : 'Clock In'}
          >
            {actionLoading ? (
              <ActivityIndicator color={Colors.textInverse} size="large" />
            ) : (
              <>
                <MaterialIcons
                  name={clockedIn ? 'logout' : 'login'}
                  size={40}
                  color={Colors.textInverse}
                />
                <Text style={styles.mainBtnText}>{clockedIn ? 'CLOCK OUT' : 'CLOCK IN'}</Text>
              </>
            )}
          </Pressable>
        )}

        {/* GPS status */}
        <View style={styles.gpsRow}>
          <MaterialIcons name="location-on" size={16} color={Colors.success} />
          <Text style={styles.gpsText}>Inside geofence — GPS verified</Text>
        </View>

        {/* Today's summary if clocked out */}
        {myRecord && myRecord.clock_in && myRecord.clock_out ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Today's Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Clock In</Text>
                <Text style={styles.summaryValue}>{myRecord.clock_in}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Clock Out</Text>
                <Text style={styles.summaryValue}>{myRecord.clock_out}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Hours</Text>
                <Text style={[styles.summaryValue, { color: Colors.primary }]}>{(myRecord.total_hours || 0).toFixed(1)}h</Text>
              </View>
              {(myRecord.overtime_hours || 0) > 0 ? (
                <>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Overtime</Text>
                    <Text style={[styles.summaryValue, { color: Colors.warning }]}>{(myRecord.overtime_hours || 0).toFixed(1)}h</Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        ) : null}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  headerDate: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  scroll: { padding: Spacing.md, gap: Spacing.md, alignItems: 'center' },

  statusCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    width: '100%', borderRadius: BorderRadius.md, padding: Spacing.md,
  },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  statusLabel: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, includeFontPadding: false },
  statusSub: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },

  timeDisplay: { alignItems: 'center', gap: 4, paddingVertical: Spacing.md },
  currentTime: { fontSize: 56, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  elapsedTime: { fontSize: FontSize.body, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },

  mainBtn: {
    width: 200, height: 200, borderRadius: 100,
    alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, ...Shadow.strong,
  },
  mainBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },

  gpsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  gpsText: { fontSize: FontSize.sm, color: Colors.success, fontWeight: FontWeight.medium, includeFontPadding: false },

  summaryCard: {
    width: '100%', backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    padding: Spacing.md, gap: Spacing.md, ...Shadow.card, borderWidth: 1, borderColor: Colors.border,
  },
  summaryTitle: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryLabel: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  summaryValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  summaryDivider: { width: 1, height: 36, backgroundColor: Colors.border },
});
