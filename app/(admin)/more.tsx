// Admin more/settings screen
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const MENU_SECTIONS = [
  {
    title: 'Management',
    items: [
      { icon: 'schedule' as const, label: 'All Timesheets', sub: 'Review company-wide hours' },
      { icon: 'rule' as const, label: 'Leave Approvals', sub: 'Manage all leave requests' },
      { icon: 'edit-calendar' as const, label: 'Manual Hour Entry', sub: 'Add hours on behalf of employee' },
    ],
  },
  {
    title: 'Reporting',
    items: [
      { icon: 'download' as const, label: 'Download CSV', sub: 'Export all approved hours' },
      { icon: 'bar-chart' as const, label: 'Analytics', sub: 'Advanced workforce insights' },
    ],
  },
  {
    title: 'System',
    items: [
      { icon: 'settings' as const, label: 'System Settings', sub: 'Configure app preferences' },
      { icon: 'security' as const, label: 'User Roles', sub: 'Manage access permissions' },
    ],
  },
];

export default function AdminMore() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'AD'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>HR / ADMIN</Text>
            </View>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {MENU_SECTIONS.map(section => (
          <View key={section.title}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map(item => (
              <Pressable key={item.label} style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.75 }]}>
                <View style={styles.menuIcon}>
                  <MaterialIcons name={item.icon} size={20} color={Colors.primary} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSub}>{item.sub}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
              </Pressable>
            ))}
          </View>
        ))}

        <Pressable onPress={logout} style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}>
          <MaterialIcons name="logout" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  scroll: { padding: Spacing.md, gap: Spacing.sm },
  profileCard: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    marginBottom: Spacing.sm, ...Shadow.panel,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
  profileInfo: { gap: 4 },
  profileName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
  roleBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2, alignSelf: 'flex-start' },
  roleBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textInverse, letterSpacing: 0.5, includeFontPadding: false },
  profileEmail: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', includeFontPadding: false },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 4, marginTop: Spacing.sm, marginBottom: 4, includeFontPadding: false },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryFaded, alignItems: 'center', justifyContent: 'center' },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: FontSize.body, fontWeight: FontWeight.medium, color: Colors.textPrimary, includeFontPadding: false },
  menuSub: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.dangerLight, borderRadius: BorderRadius.md,
    padding: Spacing.md, marginTop: Spacing.md,
  },
  logoutText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.danger, includeFontPadding: false },
});
