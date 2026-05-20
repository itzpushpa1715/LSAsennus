// Admin Finance / Revenue Tracker
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const TABS = ['Revenue', 'Labor Cost', 'Profit', 'Reports'] as const;
type Tab = (typeof TABS)[number];

// Stub monthly data
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REVENUE = [82000, 78000, 91000, 87000, 95000, 0, 0, 0, 0, 0, 0, 0];
const LABOR = [48000, 46000, 52000, 49000, 56000, 0, 0, 0, 0, 0, 0, 0];
const thisMonth = new Date().getMonth();

const MAX_BAR_H = 100;

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const h = max > 0 ? Math.max(4, (value / max) * MAX_BAR_H) : 4;
  return (
    <View style={{ height: MAX_BAR_H, justifyContent: 'flex-end' }}>
      <View style={{ height: h, width: 20, backgroundColor: color, borderRadius: 3 }} />
    </View>
  );
}

export default function FinanceScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('Revenue');

  const maxRev = Math.max(...REVENUE);
  const maxLab = Math.max(...LABOR);

  const totalRevYTD = REVENUE.slice(0, thisMonth + 1).reduce((s, v) => s + v, 0);
  const totalLabYTD = LABOR.slice(0, thisMonth + 1).reduce((s, v) => s + v, 0);
  const profitYTD = totalRevYTD - totalLabYTD;
  const marginPct = totalRevYTD > 0 ? Math.round((profitYTD / totalRevYTD) * 100) : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance & Revenue</Text>
      </View>

      <View style={styles.tabBar}>
        {TABS.map(t => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'Revenue' ? (
          <>
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiVal}>€{(totalRevYTD / 1000).toFixed(0)}k</Text>
                <Text style={styles.kpiLabel}>YTD Revenue</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiVal, { color: Colors.success }]}>€{(REVENUE[thisMonth] / 1000).toFixed(0)}k</Text>
                <Text style={styles.kpiLabel}>This Month</Text>
              </View>
            </View>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Monthly Revenue (€)</Text>
              <View style={styles.barsRow}>
                {MONTHS.map((m, i) => (
                  <View key={m} style={styles.barCol}>
                    <Bar value={REVENUE[i]} max={maxRev} color={i === thisMonth ? Colors.primary : Colors.primaryFaded} />
                    <Text style={styles.barLabel}>{m}</Text>
                    {REVENUE[i] > 0 ? <Text style={styles.barVal}>{(REVENUE[i] / 1000).toFixed(0)}k</Text> : null}
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : tab === 'Labor Cost' ? (
          <>
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiVal, { color: Colors.danger }]}>€{(totalLabYTD / 1000).toFixed(0)}k</Text>
                <Text style={styles.kpiLabel}>YTD Labor Cost</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiVal, { color: Colors.warning }]}>€{(LABOR[thisMonth] / 1000).toFixed(0)}k</Text>
                <Text style={styles.kpiLabel}>This Month</Text>
              </View>
            </View>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Monthly Labor Cost (€)</Text>
              <View style={styles.barsRow}>
                {MONTHS.map((m, i) => (
                  <View key={m} style={styles.barCol}>
                    <Bar value={LABOR[i]} max={maxLab} color={i === thisMonth ? Colors.danger : Colors.dangerLight} />
                    <Text style={styles.barLabel}>{m}</Text>
                    {LABOR[i] > 0 ? <Text style={[styles.barVal, { color: Colors.danger }]}>{(LABOR[i] / 1000).toFixed(0)}k</Text> : null}
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : tab === 'Profit' ? (
          <>
            <View style={styles.kpiRow}>
              <View style={[styles.kpiCard, { borderTopColor: profitYTD >= 0 ? Colors.success : Colors.danger }]}>
                <Text style={[styles.kpiVal, { color: profitYTD >= 0 ? Colors.success : Colors.danger }]}>€{(profitYTD / 1000).toFixed(0)}k</Text>
                <Text style={styles.kpiLabel}>YTD Profit</Text>
              </View>
              <View style={[styles.kpiCard, { borderTopColor: Colors.primary }]}>
                <Text style={[styles.kpiVal, { color: Colors.primary }]}>{marginPct}%</Text>
                <Text style={styles.kpiLabel}>Profit Margin</Text>
              </View>
            </View>
            <View style={styles.profitSummary}>
              <View style={styles.profitRow}>
                <Text style={styles.profitKey}>Total Revenue (YTD)</Text>
                <Text style={[styles.profitVal, { color: Colors.success }]}>€{totalRevYTD.toLocaleString()}</Text>
              </View>
              <View style={styles.profitRow}>
                <Text style={styles.profitKey}>Labor Cost (YTD)</Text>
                <Text style={[styles.profitVal, { color: Colors.danger }]}>-€{totalLabYTD.toLocaleString()}</Text>
              </View>
              <View style={[styles.profitRow, styles.profitRowTotal]}>
                <Text style={styles.profitKeyBold}>Net Profit</Text>
                <Text style={[styles.profitValBold, { color: profitYTD >= 0 ? Colors.success : Colors.danger }]}>€{profitYTD.toLocaleString()}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <MaterialIcons name="download" size={48} color={Colors.primary} />
            <Text style={styles.emptyTitle}>Financial Reports</Text>
            <Text style={styles.emptySub}>Download CSV reports for payroll, labor cost, and revenue analysis</Text>
            <Pressable style={styles.downloadBtn}>
              <MaterialIcons name="download" size={18} color={Colors.textInverse} />
              <Text style={styles.downloadText}>Download Full Report</Text>
            </Pressable>
          </View>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  tabBar: { flexDirection: 'row', backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, paddingVertical: Spacing.sm + 2, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textMuted, includeFontPadding: false },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  scroll: { padding: Spacing.md, gap: Spacing.md },
  kpiRow: { flexDirection: 'row', gap: Spacing.sm },
  kpiCard: { flex: 1, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, borderTopWidth: 3, borderTopColor: Colors.primary, ...Shadow.card, borderWidth: 1, borderColor: Colors.border, gap: 2 },
  kpiVal: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  kpiLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, includeFontPadding: false },
  chartCard: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  chartTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: Spacing.md, includeFontPadding: false },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  barCol: { flex: 1, alignItems: 'center', gap: 2 },
  barLabel: { fontSize: 9, color: Colors.textMuted, includeFontPadding: false },
  barVal: { fontSize: 9, color: Colors.primary, fontWeight: FontWeight.semibold, includeFontPadding: false },
  profitSummary: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card, borderWidth: 1, borderColor: Colors.border },
  profitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  profitRowTotal: { borderTopWidth: 1, borderTopColor: Colors.border, marginTop: Spacing.xs, paddingTop: Spacing.sm },
  profitKey: { fontSize: FontSize.body, color: Colors.textSecondary, includeFontPadding: false },
  profitKeyBold: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  profitVal: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, includeFontPadding: false },
  profitValBold: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, includeFontPadding: false },
  empty: { alignItems: 'center', paddingTop: 48, gap: Spacing.md },
  emptyTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  emptySub: { fontSize: FontSize.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, includeFontPadding: false },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  downloadText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textInverse, includeFontPadding: false },
});
