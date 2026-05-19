import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlert } from '@/template';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { useEmployee } from '@/hooks/useEmployees';
import { fetchShiftsForEmployee } from '@/services/supabase/shiftService';
import { useState, useEffect } from 'react';
import type { ShiftRow } from '@/services/supabase/shiftService';

const DEPT_COLORS: Record<string, string> = {
  Electrical: Colors.morningShift,
  Welding: Colors.copper,
  Piping: Colors.activeProject,
  Operations: Colors.accent,
  Administration: Colors.nightShift,
};

export default function EmployeeDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { employee, loading } = useEmployee(id || '');
  const [recentShifts, setRecentShifts] = useState<ShiftRow[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchShiftsForEmployee(id).then(({ data }) => setRecentShifts(data.slice(0, 3)));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  if (!employee) return null;

  const deptColor = DEPT_COLORS[employee.department] || Colors.accent;
  const initials = employee.full_name.split(' ').map(n => n[0]).slice(0, 2).join('');
  const documents = employee.employee_documents || [];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <View style={[styles.header, { backgroundColor: Colors.primary }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textLight} />
        </Pressable>
        <Text style={styles.headerTitle}>Employee Profile</Text>
        <Pressable
          onPress={() => showAlert('Edit', 'Employee editing will be available in the next version.')}
          hitSlop={8}
        >
          <MaterialIcons name="edit" size={22} color={Colors.accent} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile hero */}
        <View style={[styles.profileHero, { backgroundColor: Colors.primary }]}>
          <View style={[styles.avatar, { backgroundColor: deptColor + '25', borderColor: deptColor }]}>
            <Text style={[styles.avatarText, { color: deptColor }]}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{employee.full_name}</Text>
          <Text style={styles.profileRole}>{employee.role}</Text>
          <View style={styles.profileBadgeRow}>
            <StatusBadge variant={employee.status as any} />
            <View style={[styles.deptBadge, { backgroundColor: deptColor + '25' }]}>
              <Text style={[styles.deptBadgeText, { color: deptColor }]}>{employee.department}</Text>
            </View>
          </View>
          <Text style={styles.profileId}>{employee.employee_id}</Text>
        </View>

        <View style={styles.content}>
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: Colors.success }]}>{employee.attendance_rate}%</Text>
              <Text style={styles.statLbl}>Attendance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: Colors.overtimeShift }]}>{employee.overtime_hours}h</Text>
              <Text style={styles.statLbl}>Overtime</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: Colors.accent }]}>€{employee.hourly_rate}</Text>
              <Text style={styles.statLbl}>Per Hour</Text>
            </View>
          </View>

          {/* Employment Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Employment Details</Text>
            <InfoItem icon="work" label="Contract Type" value={employee.contract_type} />
            <InfoItem icon="event" label="Start Date" value={employee.start_date} />
            <InfoItem icon="flag" label="Nationality" value={employee.nationality || 'N/A'} />
            <InfoItem icon="phone" label="Phone" value={employee.phone || 'N/A'} />
            <InfoItem icon="email" label="Email" value={employee.email} />
            {employee.tes_category ? (
              <InfoItem icon="gavel" label="TES Category" value={employee.tes_category} />
            ) : null}
          </View>

          {/* Documents */}
          {documents.length > 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Compliance Documents</Text>
              {documents.map((doc, idx) => (
                <View
                  key={doc.id}
                  style={[styles.docRow, idx < documents.length - 1 && styles.docRowBorder]}
                >
                  <View style={styles.docIconWrap}>
                    <MaterialIcons
                      name={doc.status === 'expired' ? 'error' : doc.status === 'expiring' ? 'warning' : 'verified'}
                      size={18}
                      color={
                        doc.status === 'expired' ? Colors.error :
                        doc.status === 'expiring' ? Colors.warning :
                        Colors.success
                      }
                    />
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docName}>{doc.type}</Text>
                    <Text style={styles.docExpiry}>Expires: {doc.expiry_date || 'N/A'}</Text>
                  </View>
                  <StatusBadge variant={doc.status as any} size="sm" />
                </View>
              ))}
              {documents.some(d => d.status !== 'valid') ? (
                <Pressable
                  style={styles.uploadDocBtn}
                  onPress={() => showAlert('Upload', 'Document upload will be available in the next version.')}
                >
                  <MaterialIcons name="upload" size={16} color={Colors.accent} />
                  <Text style={styles.uploadDocText}>Upload Renewal</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {/* Recent Shifts */}
          {recentShifts.length > 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent Shifts</Text>
              {recentShifts.map((shift, idx) => (
                <View
                  key={shift.id}
                  style={[styles.shiftRow, idx < recentShifts.length - 1 && styles.shiftRowBorder]}
                >
                  <View style={styles.shiftTypeChip}>
                    <Text style={styles.shiftTypeText}>
                      {shift.type.charAt(0).toUpperCase() + shift.type.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.shiftMeta}>
                    <Text style={styles.shiftDate}>{shift.date}</Text>
                    <Text style={styles.shiftTime}>{shift.start_time} – {shift.end_time}</Text>
                    <Text style={styles.shiftSite}>{shift.site}</Text>
                  </View>
                  <StatusBadge variant={shift.status as any} size="sm" />
                </View>
              ))}
            </View>
          ) : null}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.actionBtnSecondary, pressed && { opacity: 0.8 }]}
              onPress={() => showAlert('Message', 'Internal chat will be available in the next version.')}
            >
              <MaterialIcons name="chat" size={18} color={Colors.accent} />
              <Text style={styles.actionBtnSecondaryText}>Message</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.actionBtnPrimary, pressed && { opacity: 0.85 }]}
              onPress={() => showAlert('Assign Shift', 'Shift assignment will be available in the next version.')}
            >
              <MaterialIcons name="add" size={18} color="#fff" />
              <Text style={styles.actionBtnPrimaryText}>Assign Shift</Text>
            </Pressable>
          </View>

          <View style={{ height: Spacing.xxl }} />
        </View>
      </ScrollView>
    </View>
  );
}

function InfoItem({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={itemStyles.row}>
      <MaterialIcons name={icon} size={16} color={Colors.accent} />
      <Text style={itemStyles.label}>{label}</Text>
      <Text style={itemStyles.value}>{value}</Text>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
    gap: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderCard,
  },
  label: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  value: {
    fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary,
    includeFontPadding: false, maxWidth: '55%', textAlign: 'right',
  },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dashboardBg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
  },
  backBtn: {},
  headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textLight, includeFontPadding: false },
  profileHero: { alignItems: 'center', paddingTop: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.sm },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  avatarText: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, includeFontPadding: false },
  profileName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textLight, includeFontPadding: false },
  profileRole: { fontSize: FontSize.body, color: '#aaa', includeFontPadding: false },
  profileBadgeRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  deptBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: BorderRadius.full },
  deptBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, includeFontPadding: false },
  profileId: { fontSize: FontSize.sm, color: '#666', includeFontPadding: false },
  content: { padding: Spacing.md, gap: Spacing.md, marginTop: -Spacing.xl },
  statsRow: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md,
    ...Shadow.panel, borderWidth: 1, borderColor: Colors.borderCard,
  },
  statBox: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, includeFontPadding: false },
  statLbl: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.borderCard },
  card: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md,
    ...Shadow.card, borderWidth: 1, borderColor: Colors.borderCard, gap: 0,
  },
  cardTitle: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: Spacing.sm, includeFontPadding: false },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  docRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderCard },
  docIconWrap: { width: 28 },
  docInfo: { flex: 1 },
  docName: { fontSize: FontSize.body, fontWeight: FontWeight.medium, color: Colors.textPrimary, includeFontPadding: false },
  docExpiry: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  uploadDocBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.borderCard,
  },
  uploadDocText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: FontWeight.medium, includeFontPadding: false },
  shiftRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.sm },
  shiftRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderCard },
  shiftTypeChip: { backgroundColor: Colors.accent + '18', paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: BorderRadius.xs },
  shiftTypeText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: FontWeight.semibold, includeFontPadding: false },
  shiftMeta: { flex: 1 },
  shiftDate: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  shiftTime: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary, includeFontPadding: false },
  shiftSite: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  actionsRow: { flexDirection: 'row', gap: Spacing.md },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.md, borderRadius: BorderRadius.md },
  actionBtnPrimary: { backgroundColor: Colors.accent },
  actionBtnPrimaryText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: '#fff', includeFontPadding: false },
  actionBtnSecondary: { borderWidth: 1.5, borderColor: Colors.accent },
  actionBtnSecondaryText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.accent, includeFontPadding: false },
});
