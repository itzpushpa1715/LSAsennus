// Manager approvals screen (leave + timesheet)
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useLeaveRequests } from '@/hooks/useLeaveRequests';
import { useAlert } from '@/template';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const TABS = ['Leave', 'Timesheet'] as const;
type Tab = (typeof TABS)[number];

export default function ApprovalsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { requests, loading, approve, reject, refetch } = useLeaveRequests();
  const [tab, setTab] = useState<Tab>('Leave');
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const pending = requests.filter(r => r.status === 'pending');
  const all = requests;

  const handleApprove = async (id: string) => {
    if (!user) return;
    setActionLoading(id + '_approve');
    const err = await approve(id, user.id);
    setActionLoading(null);
    if (err) showAlert('Error', err);
  };

  const handleReject = async (id: string) => {
    if (!user) return;
    setActionLoading(id + '_reject');
    const err = await reject(id, user.id);
    setActionLoading(null);
    if (err) showAlert('Error', err);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Approvals</Text>
        {pending.length > 0 ? (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>{pending.length}</Text>
          </View>
        ) : null}
        <Pressable onPress={refetch} hitSlop={12} style={{ marginLeft: 'auto' }}>
          <MaterialIcons name="refresh" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      <View style={styles.tabBar}>
        {TABS.map(t => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} /> : (
        tab === 'Leave' ? (
          <FlatList
            data={all}
            keyExtractor={i => i.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.empty}>
                <MaterialIcons name="check-circle" size={48} color={Colors.success} />
                <Text style={styles.emptyTitle}>All caught up!</Text>
                <Text style={styles.emptySub}>No leave requests to review</Text>
              </View>
            }
            renderItem={({ item }) => {
              const isPending = item.status === 'pending';
              return (
                <View style={[styles.leaveCard, isPending && styles.leaveCardPending]}>
                  <View style={styles.leaveTop}>
                    <View style={styles.leaveAvatar}>
                      <Text style={styles.leaveAvatarText}>{item.employee_name.split(' ').map(n => n[0]).slice(0, 2).join('')}</Text>
                    </View>
                    <View style={styles.leaveInfo}>
                      <Text style={styles.leaveName}>{item.employee_name}</Text>
                      <Text style={styles.leaveType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)} Leave · {item.days} day{item.days > 1 ? 's' : ''}</Text>
                      <Text style={styles.leaveDates}>{item.start_date} → {item.end_date}</Text>
                    </View>
                    <View style={[styles.statusBadge, {
                      backgroundColor: item.status === 'approved' ? Colors.successLight : item.status === 'rejected' ? Colors.dangerLight : Colors.warningLight
                    }]}>
                      <Text style={[styles.statusText, {
                        color: item.status === 'approved' ? Colors.success : item.status === 'rejected' ? Colors.danger : Colors.warning
                      }]}>{item.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  {item.reason ? <Text style={styles.leaveReason}>{item.reason}</Text> : null}
                  {isPending ? (
                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => handleReject(item.id)}
                        style={({ pressed }) => [styles.rejectBtn, pressed && { opacity: 0.8 }]}
                        disabled={actionLoading !== null}
                      >
                        {actionLoading === item.id + '_reject' ? <ActivityIndicator size="small" color={Colors.danger} /> : (
                          <>
                            <MaterialIcons name="close" size={16} color={Colors.danger} />
                            <Text style={styles.rejectBtnText}>Reject</Text>
                          </>
                        )}
                      </Pressable>
                      <Pressable
                        onPress={() => handleApprove(item.id)}
                        style={({ pressed }) => [styles.approveBtn, pressed && { opacity: 0.8 }]}
                        disabled={actionLoading !== null}
                      >
                        {actionLoading === item.id + '_approve' ? <ActivityIndicator size="small" color={Colors.textInverse} /> : (
                          <>
                            <MaterialIcons name="check" size={16} color={Colors.textInverse} />
                            <Text style={styles.approveBtnText}>Approve</Text>
                          </>
                        )}
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.empty}>
            <MaterialIcons name="schedule" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Timesheet approvals</Text>
            <Text style={styles.emptySub}>Pending timesheet approvals will appear here</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  pendingBadge: { backgroundColor: Colors.danger, borderRadius: BorderRadius.full, minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  pendingBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
  tabBar: { flexDirection: 'row', backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, paddingVertical: Spacing.sm + 4, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textMuted, includeFontPadding: false },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  list: { padding: Spacing.md, gap: Spacing.sm },
  leaveCard: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  leaveCardPending: { borderColor: Colors.warning + '60' },
  leaveTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  leaveAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryFaded, alignItems: 'center', justifyContent: 'center' },
  leaveAvatarText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary, includeFontPadding: false },
  leaveInfo: { flex: 1, gap: 2 },
  leaveName: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  leaveType: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  leaveDates: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  statusBadge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3, alignSelf: 'flex-start' },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, includeFontPadding: false },
  leaveReason: { fontSize: FontSize.sm, color: Colors.textSecondary, fontStyle: 'italic', paddingLeft: Spacing.xs, borderLeftWidth: 2, borderLeftColor: Colors.border, includeFontPadding: false },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: Colors.danger, borderRadius: BorderRadius.sm, paddingVertical: Spacing.sm },
  rejectBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.danger, includeFontPadding: false },
  approveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: Colors.success, borderRadius: BorderRadius.sm, paddingVertical: Spacing.sm },
  approveBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textInverse, includeFontPadding: false },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  emptySub: { fontSize: FontSize.body, color: Colors.textSecondary, includeFontPadding: false },
});
