// Tasks screen (employee)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  dueTime?: string;
  dueDate: string;
  completed: boolean;
  overdue?: boolean;
}

const PRIORITY_COLORS = { High: Colors.danger, Medium: Colors.warning, Low: Colors.success };
const TABS = ['Today', 'Upcoming', 'Completed'] as const;
type Tab = (typeof TABS)[number];

// Stub tasks (connect to backend in next phase)
const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Safety inspection — Dock 3', priority: 'High', dueTime: '10:00', dueDate: new Date().toISOString().split('T')[0], completed: false },
  { id: '2', title: 'Submit weekly tools inventory', priority: 'Medium', dueTime: '14:00', dueDate: new Date().toISOString().split('T')[0], completed: false },
  { id: '3', title: 'Sign off on welding certificates', priority: 'Low', dueDate: new Date().toISOString().split('T')[0], completed: false },
  { id: '4', title: 'Scaffold assembly — Hull B', priority: 'High', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], completed: false },
  { id: '5', title: 'Equipment calibration log', priority: 'Medium', dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], completed: false },
  { id: '6', title: 'Site safety briefing', priority: 'Low', dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], completed: true },
];

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('Today');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const today = new Date().toISOString().split('T')[0];

  const toggle = (id: string) => setTasks(ts => ts.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const todayTasks = tasks.filter(t => t.dueDate === today && !t.completed);
  const upcomingTasks = tasks.filter(t => t.dueDate > today && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const activeList = tab === 'Today' ? todayTasks : tab === 'Upcoming' ? upcomingTasks : completedTasks;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{todayTasks.length} today</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(t => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={activeList}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="task-alt" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No tasks here</Text>
            <Text style={styles.emptySub}>
              {tab === 'Today' ? 'All caught up for today!' : tab === 'Upcoming' ? 'No upcoming tasks' : 'No completed tasks yet'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.taskCard, item.completed && styles.taskCardDone]}>
            <Pressable
              onPress={() => toggle(item.id)}
              style={[styles.checkbox, item.completed && styles.checkboxDone]}
              hitSlop={8}
            >
              {item.completed ? <MaterialIcons name="check" size={14} color={Colors.textInverse} /> : null}
            </Pressable>
            <View style={styles.taskContent}>
              <View style={styles.taskTop}>
                <Text style={[styles.taskTitle, item.completed && styles.taskTitleDone]} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[item.priority] + '20' }]}>
                  <Text style={[styles.priorityText, { color: PRIORITY_COLORS[item.priority] }]}>{item.priority}</Text>
                </View>
              </View>
              {item.dueTime ? (
                <View style={styles.taskMeta}>
                  <MaterialIcons name="schedule" size={13} color={Colors.textMuted} />
                  <Text style={styles.taskMetaText}>Due {item.dueTime}</Text>
                </View>
              ) : null}
              {item.description ? <Text style={styles.taskDesc} numberOfLines={2}>{item.description}</Text> : null}
            </View>
          </View>
        )}
      />
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
  badge: { backgroundColor: Colors.primaryFaded, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 4 },
  badgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.primary, includeFontPadding: false },
  tabBar: {
    flexDirection: 'row', backgroundColor: Colors.cardBg,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  tabBtn: { flex: 1, paddingVertical: Spacing.sm + 4, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textMuted, includeFontPadding: false },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  list: { padding: Spacing.md, gap: Spacing.sm },
  taskCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    padding: Spacing.md, ...Shadow.card, borderWidth: 1, borderColor: Colors.border,
  },
  taskCardDone: { opacity: 0.6 },
  checkbox: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkboxDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  taskContent: { flex: 1, gap: 4 },
  taskTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  taskTitle: { flex: 1, fontSize: FontSize.body, fontWeight: FontWeight.medium, color: Colors.textPrimary, includeFontPadding: false },
  taskTitleDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  priorityBadge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  priorityText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, includeFontPadding: false },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  taskMetaText: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  taskDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18, includeFontPadding: false },
  empty: { alignItems: 'center', paddingTop: 64, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  emptySub: { fontSize: FontSize.body, color: Colors.textSecondary, includeFontPadding: false },
});
