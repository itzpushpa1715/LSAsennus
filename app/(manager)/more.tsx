// Manager more/profile screen
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const MENU_ITEMS = [
  { icon: 'schedule' as const, label: 'Timesheet Approval', route: null },
  { icon: 'people' as const, label: 'My Team', route: null },
  { icon: 'edit-calendar' as const, label: 'Manual Hour Entry', route: null },
  { icon: 'download' as const, label: 'Download CSV Report', route: null },
];

export default function ManagerMore() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'MG'}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileRole}>Manager · {user?.department}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {MENU_ITEMS.map(item => (
          <Pressable key={item.label} style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.75 }]}>
            <View style={styles.menuIcon}>
              <MaterialIcons name={item.icon} size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </Pressable>
        ))}

        <Pressable onPress={logout} style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}>
          <MaterialIcons name="logout" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  scroll: { padding: Spacing.md, gap: Spacing.sm },
  profileCard: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, ...Shadow.card, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
  profileName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  profileRole: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium, includeFontPadding: false },
  profileEmail: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryFaded, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.body, fontWeight: FontWeight.medium, color: Colors.textPrimary, includeFontPadding: false },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.dangerLight, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md },
  logoutText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.danger, includeFontPadding: false },
});
