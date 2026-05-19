import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlert } from '@/template';
import { useAuth } from '@/hooks/useAuth';
import { useLeaveRequests } from '@/hooks/useLeaveRequests';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import type { LeaveRequestRow } from '@/services/supabase/siteLeaveService';

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const { requests, pending, loading, approve, reject } = useLeaveRequests();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequestRow | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';

  const handleApprove = async (leave: LeaveRequestRow) => {
    if (!user) return;
    setActionLoading(true);
    const err = await approve(leave.id, user.id);
    setActionLoading(false);
    if (err) {
      showAlert('Error', err);
    } else {
      showAlert('Approved', `Leave approved for ${leave.employee_name}`);
      setShowLeaveModal(false);
    }
  };

  const handleReject = async (leave: LeaveRequestRow) => {
    if (!user) return;
    setActionLoading(true);
    const err = await reject(leave.id, user.id);
    setActionLoading(false);
    if (err) {
      showAlert('Error', err);
    } else {
      showAlert('Rejected', `Leave request rejected for ${leave.employee_name}`);
      setShowLeaveModal(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile */}
        <Text style={styles.section}>My Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {user?.name.split(' ').map(n => n[0]).slice(0, 2).join('') || 'US'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileRole}>{user?.role}</Text>
            <Text style={styles.profileDept}>{user?.email}</Text>
          </View>
        </View>

        {/* Leave Requests (Admin/Supervisor) */}
        {!isEmployee ? (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.section}>Leave Requests</Text>
              {pending.length > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pending.length}</Text>
                </View>
              ) : null}
            </View>
            {loading ? (
              <ActivityIndicator color={Colors.accent} style={{ marginVertical: Spacing.md }} />
            ) : (
              requests.map(leave => (
                <Pressable
                  key={leave.id}
                  onPress={() => { setSelectedLeave(leave); setShowLeaveModal(true); }}
                  style={({ pressed }) => [styles.leaveCard, pressed && { opacity: 0.88 }]}
                >
                  <View style={styles.leaveLeft}>
                    <View style={styles.leaveAvatarWrap}>
                      <Text style={styles.leaveAvatar}>
                        {leave.employee_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.leaveName}>{leave.employee_name}</Text>
                      <Text style={styles.leaveType}>
                        {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave · {leave.days} day{leave.days > 1 ? 's' : ''}
                      </Text>
                      <Text style={styles.leaveDates}>{leave.start_date} → {leave.end_date}</Text>
                    </View>
                  </View>
                  <StatusBadge variant={leave.status as any} size="sm" />
                </Pressable>
              ))
            )}
          </>
        ) : null}

        {/* Quick Actions */}
        <Text style={styles.section}>Quick Actions</Text>
        <View style={styles.card}>
          {[
            { icon: 'event-available' as const, label: 'Apply for Leave', color: Colors.accent },
            { icon: 'upload-file' as const, label: 'Upload Document', color: Colors.copper },
            { icon: 'chat' as const, label: 'Internal Chat', color: Colors.success },
            { icon: 'campaign' as const, label: 'Announcements', color: Colors.nightShift },
            { icon: 'bar-chart' as const, label: 'Payroll Summary', color: Colors.eveningShift },
          ].map((item, idx, arr) => (
            <Pressable
              key={item.label}
              onPress={() => showAlert('Coming Soon', `${item.label} will be available in the next version.`)}
              style={({ pressed }) => [
                styles.actionRow,
                idx < arr.length - 1 && styles.actionRowBorder,
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: item.color + '18' }]}>
                <MaterialIcons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.actionLabel}>{item.label}</Text>
              <MaterialIcons name="chevron-right" size={20} color={Colors.borderDark} />
            </Pressable>
          ))}
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={() => showAlert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: logout },
          ])}
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}
        >
          <MaterialIcons name="logout" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.appInfo}>LS-ASENNUS Workforce v2.0  •  © 2026 LS-ASENNUS Oy</Text>
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* Leave Detail Modal */}
      <Modal
        visible={showLeaveModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLeaveModal(false)}
      >
        {selectedLeave ? (
          <View style={[styles.modalRoot, { paddingTop: insets.top + Spacing.md }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Leave Request</Text>
              <Pressable onPress={() => setShowLeaveModal(false)} hitSlop={8}>
                <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.modalCard}>
                <InfoRow icon="person" label="Employee" value={selectedLeave.employee_name} />
                <InfoRow icon="event-note" label="Type" value={selectedLeave.type.charAt(0).toUpperCase() + selectedLeave.type.slice(1) + ' Leave'} />
                <InfoRow icon="date-range" label="Start" value={selectedLeave.start_date} />
                <InfoRow icon="date-range" label="End" value={selectedLeave.end_date} />
                <InfoRow icon="timer" label="Duration" value={`${selectedLeave.days} days`} />
                <InfoRow icon="notes" label="Reason" value={selectedLeave.reason || 'No reason provided'} />
              </View>
              <View style={styles.modalStatus}>
                <Text style={styles.modalStatusLabel}>Current Status</Text>
                <StatusBadge variant={selectedLeave.status as any} />
              </View>
              {selectedLeave.status === 'pending' && isAdmin ? (
                <View style={styles.modalActions}>
                  <Pressable
                    onPress={() => handleReject(selectedLeave)}
                    disabled={actionLoading}
                    style={({ pressed }) => [styles.rejectBtn, pressed && { opacity: 0.85 }]}
                  >
                    {actionLoading ? (
                      <ActivityIndicator color={Colors.error} size="small" />
                    ) : (
                      <>
                        <MaterialIcons name="close" size={18} color={Colors.error} />
                        <Text style={styles.rejectBtnText}>Reject</Text>
                      </>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => handleApprove(selectedLeave)}
                    disabled={actionLoading}
                    style={({ pressed }) => [styles.approveBtn, pressed && { opacity: 0.85 }]}
                  >
                    {actionLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <MaterialIcons name="check" size={18} color="#fff" />
                        <Text style={styles.approveBtnText}>Approve</Text>
                      </>
                    )}
                  </Pressable>
                </View>
              ) : null}
            </ScrollView>
          </View>
        ) : null}
      </Modal>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <MaterialIcons name={icon} size={18} color={Colors.accent} style={infoStyles.icon} />
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.sm },
  icon: { width: 24 },
  label: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  value: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary, includeFontPadding: false },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dashboardBg },
  header: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.borderCard,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  scroll: { padding: Spacing.md, gap: Spacing.sm },
  section: {
    fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginTop: Spacing.sm, includeFontPadding: false,
  },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.sm },
  badge: {
    backgroundColor: Colors.error, borderRadius: BorderRadius.full,
    width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 11, color: '#fff', fontWeight: FontWeight.bold, includeFontPadding: false },
  profileCard: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  profileAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.accent + '30', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.accent,
  },
  profileAvatarText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.accent, includeFontPadding: false },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textLight, includeFontPadding: false },
  profileRole: { fontSize: FontSize.sm, color: Colors.accent, textTransform: 'capitalize', includeFontPadding: false },
  profileDept: { fontSize: FontSize.xs, color: '#888', includeFontPadding: false },
  card: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md,
    ...Shadow.card, borderWidth: 1, borderColor: Colors.borderCard,
  },
  leaveCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...Shadow.card, borderWidth: 1, borderColor: Colors.borderCard, marginBottom: Spacing.sm,
  },
  leaveLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  leaveAvatarWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.copper + '20', alignItems: 'center', justifyContent: 'center',
  },
  leaveAvatar: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.copper, includeFontPadding: false },
  leaveName: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  leaveType: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  leaveDates: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm + 2 },
  actionRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderCard },
  actionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { flex: 1, fontSize: FontSize.body, color: Colors.textPrimary, fontWeight: FontWeight.medium, includeFontPadding: false },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.card, borderRadius: BorderRadius.md, paddingVertical: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.error, marginTop: Spacing.sm,
  },
  logoutText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.error, includeFontPadding: false },
  appInfo: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.md, includeFontPadding: false },
  modalRoot: { flex: 1, backgroundColor: Colors.dashboardBg },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingBottom: Spacing.md,
    backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.borderCard,
  },
  modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  modalContent: { padding: Spacing.md, gap: Spacing.md },
  modalCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md,
    ...Shadow.card, borderWidth: 1, borderColor: Colors.borderCard,
  },
  modalStatus: { gap: Spacing.xs },
  modalStatusLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  modalActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs,
    paddingVertical: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.error,
  },
  rejectBtnText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.error, includeFontPadding: false },
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs,
    paddingVertical: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.success,
  },
  approveBtnText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: '#fff', includeFontPadding: false },
});
