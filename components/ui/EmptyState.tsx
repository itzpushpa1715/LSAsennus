// EmptyState — illustration + message
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/theme';

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'inbox', title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        <MaterialIcons name={icon as any} size={48} color={Colors.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}>
          <Text style={styles.btnText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: 32, gap: Spacing.sm },
  iconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  title: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center', includeFontPadding: false },
  subtitle: { fontSize: FontSize.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, includeFontPadding: false },
  btn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, marginTop: Spacing.sm },
  btnText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textInverse, includeFontPadding: false },
});
