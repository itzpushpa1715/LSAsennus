import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable, FlatList, ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EmployeeCard } from '@/components/feature/EmployeeCard';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useEmployees } from '@/hooks/useEmployees';
import { getExpiryAlertCount, type EmployeeRow } from '@/services/supabase/employeeService';

const DEPARTMENTS = ['All', 'Electrical', 'Welding', 'Piping', 'Operations', 'Administration'];

export default function EmployeesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { employees, loading, error, refetch } = useEmployees();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchSearch =
        !search ||
        e.full_name.toLowerCase().includes(search.toLowerCase()) ||
        e.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        e.role.toLowerCase().includes(search.toLowerCase());
      const matchDept = dept === 'All' || e.department === dept;
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && e.status === 'active') ||
        (statusFilter === 'On Leave' && e.status === 'on-leave') ||
        (statusFilter === 'Inactive' && e.status === 'inactive');
      return matchSearch && matchDept && matchStatus;
    });
  }, [search, dept, statusFilter, employees]);

  const expiryAlerts = getExpiryAlertCount(employees);

  // Adapt EmployeeRow → Employee shape for EmployeeCard
  const toCard = (e: EmployeeRow) => ({
    id: e.id,
    name: e.full_name,
    employeeId: e.employee_id,
    role: e.role,
    department: e.department,
    nationality: e.nationality || '',
    phone: e.phone || '',
    email: e.email,
    contractType: e.contract_type,
    startDate: e.start_date,
    hourlyRate: e.hourly_rate,
    status: e.status,
    documents: (e.employee_documents || []).map(d => ({
      type: d.type,
      expiryDate: d.expiry_date || '',
      status: d.status,
    })),
    attendanceRate: e.attendance_rate,
    overtimeHours: e.overtime_hours,
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScreenHeader
        title="Employees"
        subtitle={loading ? 'Loading...' : `${employees.length} total  ·  ${filtered.length} shown`}
        rightIcon="person-add"
      />

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <MaterialIcons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, ID, role..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            accessibilityLabel="Search employees"
          />
          {search.length > 0 ? (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <MaterialIcons name="close" size={16} color={Colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Expiry alert */}
      {expiryAlerts > 0 ? (
        <View style={styles.docAlert}>
          <MaterialIcons name="error" size={14} color={Colors.error} />
          <Text style={styles.docAlertText}>{expiryAlerts} expired or expiring document(s) need attention</Text>
        </View>
      ) : null}

      {/* Department filter */}
      <View style={styles.chipOuter}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContent}
        >
          {DEPARTMENTS.map(d => (
            <Pressable
              key={d}
              onPress={() => setDept(d)}
              style={[styles.chip, dept === d && styles.chipActive]}
            >
              <Text style={[styles.chipText, dept === d && styles.chipTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={Colors.accent} size="large" />
          <Text style={styles.loadingText}>Loading employees...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EmployeeCard
              employee={toCard(item)}
              onPress={() => router.push({ pathname: '/employee-detail', params: { id: item.id } })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialIcons name="person-search" size={48} color={Colors.borderDark} />
              <Text style={styles.emptyText}>No employees found</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dashboardBg },
  searchRow: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.borderCard,
  },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.dashboardBg, borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs + 2,
    gap: Spacing.xs, borderWidth: 1, borderColor: Colors.borderCard,
  },
  searchInput: { flex: 1, fontSize: FontSize.body, color: Colors.textPrimary, includeFontPadding: false },
  docAlert: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.errorLight, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
  },
  docAlertText: { fontSize: FontSize.xs, color: Colors.error, fontWeight: FontWeight.medium, includeFontPadding: false },
  chipOuter: { height: 52, backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.borderCard },
  chipContent: {
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: BorderRadius.full,
    backgroundColor: Colors.dashboardBg, borderWidth: 1, borderColor: Colors.borderCard,
    height: 32, justifyContent: 'center',
  },
  chipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  chipTextActive: { color: Colors.textLight, fontWeight: FontWeight.semibold },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  loadingText: { fontSize: FontSize.sm, color: Colors.textMuted, includeFontPadding: false },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  empty: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.md },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, includeFontPadding: false },
});
