// Leave request screen (employee)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  FlatList, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useLeaveRequests } from '@/hooks/useLeaveRequests';
import { useAlert } from '@/template';
import { submitLeaveRequest } from '@/services/supabase/siteLeaveService';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const LEAVE_TYPES = ['Annual', 'Sick', 'Unpaid', 'Parental', 'Emergency'] as const;
const STATUS_STYLES = {
  pending: { bg: Colors.warningLight, text: Colors.warning },
  approved: { bg: Colors.successLight, text: Colors.success },
  rejected: { bg: Colors.dangerLight, text: Colors.danger },
};

export default function LeaveScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { requests, loading, refetch } = useLeaveRequests();

  const [leaveType, setLeaveType] = useState<string>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, diff);
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) { showAlert('Missing Dates', 'Please enter start and end dates.'); return; }
    if (!user?.employeeId) { showAlert('Error', 'Employee profile not linked.'); return; }
    setSubmitting(true);
    const days = calcDays();
    const { error } = await submitLeaveRequest(
      user.employeeId, user.name,
      leaveType.toLowerCase() as any,
      startDate, endDate, days, reason,
    );
    setSubmitting(false);
    if (error) { showAlert('Submit Failed', error); return; }
    showAlert('Request Submitted', 'Your leave request is pending approval.');
    setStartDate(''); setEndDate(''); setReason('');
    setShowForm(false);
    refetch();
  };

  const myRequests = requests.filter(r => r.employee_name === user?.name);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leave Management</Text>
        <Pressable onPress={() => setShowForm(v => !v)} style={styles.newBtn}>
          <MaterialIcons name={showForm ? 'close' : 'add'} size={20} color={Colors.textInverse} />
          <Text style={styles.newBtnText}>{showForm ? 'Cancel' : 'New Request'}</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Balance cards */}
        <View style={styles.balanceRow}>
          {[{ type: 'Annual', days: 24, color: Colors.primary }, { type: 'Sick', days: 10, color: Colors.success }, { type: 'Unpaid', days: '∞', color: Colors.textSecondary }].map(b => (
            <View key={b.type} style={styles.balanceCard}>
              <Text style={[styles.balanceDays, { color: b.color }]}>{b.days}</Text>
              <Text style={styles.balanceType}>{b.type}</Text>
              <Text style={styles.balanceLabel}>days left</Text>
            </View>
          ))}
        </View>

        {/* New request form */}
        {showForm ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Leave Request</Text>

            <Text style={styles.fieldLabel}>Leave Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
              {LEAVE_TYPES.map(t => (
                <Pressable key={t} onPress={() => setLeaveType(t)} style={[styles.typePill, leaveType === t && styles.typePillActive]}>
                  <Text style={[styles.typePillText, leaveType === t && styles.typePillTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.dateRow}>
              <View style={styles.dateFld}>
                <Text style={styles.fieldLabel}>Start Date</Text>
                <TextInput
                  style={styles.dateInput}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
              <View style={styles.dateFld}>
                <Text style={styles.fieldLabel}>End Date</Text>
                <TextInput
                  style={styles.dateInput}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>
            {calcDays() > 0 ? <Text style={styles.daysCalc}>{calcDays()} day{calcDays() > 1 ? 's' : ''} selected</Text> : null}

            <Text style={styles.fieldLabel}>Reason (optional)</Text>
            <TextInput
              style={styles.reasonInput}
              value={reason}
              onChangeText={setReason}
              placeholder="Briefly explain your reason..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
            />

            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.88 }]}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color={Colors.textInverse} /> : <Text style={styles.submitText}>Submit Request</Text>}
            </Pressable>
          </View>
        ) : null}

        {/* My requests */}
        <Text style={styles.sectionTitle}>My Requests</Text>
        {loading ? <ActivityIndicator color={Colors.primary} /> : null}
        {myRequests.map(r => {
          const st = STATUS_STYLES[r.status];
          return (
            <View key={r.id} style={styles.requestCard}>
              <View style={styles.requestTop}>
                <Text style={styles.requestType}>{r.type.charAt(0).toUpperCase() + r.type.slice(1)} Leave</Text>
                <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.text }]}>{r.status.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.requestDates}>{r.start_date} → {r.end_date} · {r.days} day{r.days > 1 ? 's' : ''}</Text>
              {r.reason ? <Text style={styles.requestReason}>{r.reason}</Text> : null}
            </View>
          );
        })}
        {!loading && myRequests.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="beach-access" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No leave requests yet</Text>
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
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  newBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textInverse, includeFontPadding: false },
  scroll: { padding: Spacing.md, gap: Spacing.md },
  balanceRow: { flexDirection: 'row', gap: Spacing.sm },
  balanceCard: { flex: 1, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', gap: 2, ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  balanceDays: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, includeFontPadding: false },
  balanceType: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  balanceLabel: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  formCard: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, gap: Spacing.md, ...Shadow.panel },
  formTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary, includeFontPadding: false },
  typeRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 2 },
  typePill: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },
  typePillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typePillText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, includeFontPadding: false },
  typePillTextActive: { color: Colors.textInverse, fontWeight: FontWeight.semibold },
  dateRow: { flexDirection: 'row', gap: Spacing.sm },
  dateFld: { flex: 1, gap: 4 },
  dateInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, fontSize: FontSize.body, color: Colors.textPrimary, backgroundColor: Colors.surfaceAlt },
  daysCalc: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold, includeFontPadding: false },
  reasonInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: FontSize.body, color: Colors.textPrimary, backgroundColor: Colors.surfaceAlt, minHeight: 80, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, alignItems: 'center' },
  submitText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textInverse, includeFontPadding: false },
  sectionTitle: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  requestCard: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, gap: 4, ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  requestTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  requestType: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  statusBadge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, includeFontPadding: false },
  requestDates: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  requestReason: { fontSize: FontSize.sm, color: Colors.textMuted, fontStyle: 'italic', includeFontPadding: false },
  empty: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xl },
  emptyText: { fontSize: FontSize.body, color: Colors.textSecondary, includeFontPadding: false },
});
