// Admin Employees screen
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  TextInput, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEmployees } from '@/hooks/useEmployees';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const FILTERS = ['All', 'Active', 'On Leave', 'Inactive'] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminEmployees() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { employees, loading, refetch } = useEmployees();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = !search || e.full_name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'All' || (filter === 'Active' && e.status === 'active') || (filter === 'On Leave' && e.status === 'on-leave') || (filter === 'Inactive' && e.status === 'inactive');
      return matchSearch && matchFilter;
    });
  }, [employees, search, filter]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Employees</Text>
        <Text style={styles.headerCount}>{employees.length} total</Text>
        <Pressable onPress={refetch} hitSlop={12} style={{ marginLeft: 'auto' }}>
          <MaterialIcons name="refresh" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Search employees"
        />
        {search ? (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <MaterialIcons name="close" size={18} color={Colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <Pressable key={f} onPress={() => setFilter(f)} style={[styles.filterPill, filter === f && styles.filterPillActive]}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} /> : (
        <FlatList
          data={filtered}
          keyExtractor={e => e.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialIcons name="people" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No employees found</Text>
            </View>
          }
          renderItem={({ item }) => {
            const initials = item.full_name.split(' ').map(n => n[0]).slice(0, 2).join('');
            const statusColor = item.status === 'active' ? Colors.success : item.status === 'on-leave' ? Colors.warning : Colors.textMuted;
            return (
              <Pressable
                onPress={() => router.push({ pathname: '/employee-detail', params: { id: item.id } })}
                style={({ pressed }) => [styles.empRow, pressed && { opacity: 0.8 }]}
              >
                <View style={styles.empAvatar}>
                  <Text style={styles.empAvatarText}>{initials}</Text>
                </View>
                <View style={styles.empInfo}>
                  <Text style={styles.empName}>{item.full_name}</Text>
                  <Text style={styles.empRole}>{item.role} · {item.department}</Text>
                  <Text style={styles.empEmail}>{item.email}</Text>
                </View>
                <View style={styles.empRight}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                  <Text style={[styles.statusLabel, { color: statusColor }]}>{item.status}</Text>
                  <Text style={styles.empRate}>€{item.hourly_rate}/h</Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  headerCount: { fontSize: FontSize.sm, color: Colors.textMuted, includeFontPadding: false },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, margin: Spacing.md, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, borderWidth: 1, borderColor: Colors.border },
  searchInput: { flex: 1, fontSize: FontSize.body, color: Colors.textPrimary, includeFontPadding: false },
  filterRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  filterPill: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },
  filterPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, includeFontPadding: false },
  filterTextActive: { color: Colors.textInverse, fontWeight: FontWeight.semibold },
  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.xs + 2 },
  empRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  empAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryFaded, alignItems: 'center', justifyContent: 'center' },
  empAvatarText: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.primary, includeFontPadding: false },
  empInfo: { flex: 1, gap: 2 },
  empName: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  empRole: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  empEmail: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  empRight: { alignItems: 'flex-end', gap: 3 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, textTransform: 'capitalize', includeFontPadding: false },
  empRate: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  empty: { alignItems: 'center', paddingTop: 64, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.body, color: Colors.textSecondary, includeFontPadding: false },
});
