// Shift swap stub screen (employee)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

export default function ShiftSwapScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Shift Swap</Text>
      </View>
      <View style={styles.center}>
        <MaterialIcons name="swap-horiz" size={56} color={Colors.primary} />
        <Text style={styles.comingSoon}>Shift Swap</Text>
        <Text style={styles.sub}>Request and manage shift swaps with colleagues. Coming in next update.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: 32 },
  comingSoon: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  sub: { fontSize: FontSize.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, includeFontPadding: false },
});
