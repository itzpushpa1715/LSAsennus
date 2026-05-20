// Messages & Announcements screen (employee)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const TABS = ['Messages', 'Announcements'] as const;
type Tab = (typeof TABS)[number];

const MOCK_CONVERSATIONS = [
  { id: '1', name: 'Matti Virtanen', role: 'Supervisor', lastMsg: 'Remember to submit your hours by Friday.', time: '10:32', unread: 2, initials: 'MV' },
  { id: '2', name: 'HR Team', role: 'Admin', lastMsg: 'Your leave request has been reviewed.', time: 'Yesterday', unread: 0, initials: 'HR' },
  { id: '3', name: 'Site Alpha Team', role: 'Group', lastMsg: 'Morning brief at 06:45 tomorrow.', time: 'Mon', unread: 5, initials: 'SA' },
];

const MOCK_ANNOUNCEMENTS = [
  { id: '1', author: 'HR Department', title: 'New Safety Protocols — Q3 2026', body: 'Please review the updated safety protocols attached. All employees must complete the refresher by June 30.', time: '2h ago', read: false },
  { id: '2', author: 'Site Manager', title: 'Shift Schedule — Week 22', body: 'The schedule for week 22 has been published. Check your shifts in the Schedule tab.', time: '1d ago', read: false },
  { id: '3', author: 'LS-ASENNUS Oy', title: 'Summer Holiday Policy 2026', body: 'Annual leave booking for summer 2026 is now open. Submit your preferences before May 31.', time: '3d ago', read: true },
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('Messages');
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);

  const markRead = (id: string) => setAnnouncements(a => a.map(x => x.id === id ? { ...x, read: true } : x));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{MOCK_CONVERSATIONS.reduce((s, c) => s + c.unread, 0) + announcements.filter(a => !a.read).length}</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        {TABS.map(t => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'Messages' ? (
        <FlatList
          data={MOCK_CONVERSATIONS}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable style={({ pressed }) => [styles.convRow, pressed && { opacity: 0.8 }]}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{item.initials}</Text>
              </View>
              <View style={styles.convContent}>
                <View style={styles.convTop}>
                  <Text style={styles.convName}>{item.name}</Text>
                  <Text style={styles.convTime}>{item.time}</Text>
                </View>
                <View style={styles.convBottom}>
                  <Text style={styles.convPreview} numberOfLines={1}>{item.lastMsg}</Text>
                  {item.unread > 0 ? (
                    <View style={styles.unreadCount}>
                      <Text style={styles.unreadCountText}>{item.unread}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => markRead(item.id)}
              style={({ pressed }) => [styles.annoCard, !item.read && styles.annoCardUnread, pressed && { opacity: 0.85 }]}
            >
              {!item.read ? <View style={styles.annoUnreadBar} /> : null}
              <View style={styles.annoContent}>
                <View style={styles.annoTop}>
                  <Text style={styles.annoAuthor}>{item.author}</Text>
                  <Text style={styles.annoTime}>{item.time}</Text>
                </View>
                <Text style={styles.annoTitle}>{item.title}</Text>
                <Text style={styles.annoBody} numberOfLines={2}>{item.body}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, flex: 1, includeFontPadding: false },
  unreadBadge: { backgroundColor: Colors.danger, borderRadius: BorderRadius.full, minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
  tabBar: { flexDirection: 'row', backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, paddingVertical: Spacing.sm + 4, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textMuted, includeFontPadding: false },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  list: { gap: 1 },
  convRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.cardBg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
  },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.primary, includeFontPadding: false },
  convContent: { flex: 1, gap: 4 },
  convTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convName: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  convTime: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  convBottom: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  convPreview: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  unreadCount: { backgroundColor: Colors.primary, borderRadius: BorderRadius.full, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadCountText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
  annoCard: {
    flexDirection: 'row', backgroundColor: Colors.cardBg,
    marginHorizontal: Spacing.md, marginTop: Spacing.sm,
    borderRadius: BorderRadius.md, overflow: 'hidden', ...Shadow.card,
    borderWidth: 1, borderColor: Colors.border,
  },
  annoCardUnread: { borderColor: Colors.info },
  annoUnreadBar: { width: 4, backgroundColor: Colors.info },
  annoContent: { flex: 1, padding: Spacing.md, gap: 4 },
  annoTop: { flexDirection: 'row', justifyContent: 'space-between' },
  annoAuthor: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.primary, includeFontPadding: false },
  annoTime: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  annoTitle: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  annoBody: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18, includeFontPadding: false },
});
