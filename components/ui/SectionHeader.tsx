// SectionHeader component
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <MaterialIcons name="chevron-right" size={16} color={Colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  subtitle: { fontSize: FontSize.xs, color: Colors.textMuted, includeFontPadding: false },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  actionText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.primary, includeFontPadding: false },
});
