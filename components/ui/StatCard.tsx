import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof MaterialIcons.glyphMap;
  color?: string;
  bgColor?: string;
  subtitle?: string;
  onPress?: () => void;
  small?: boolean;
}

export const StatCard = memo(function StatCard({
  label,
  value,
  icon,
  color = Colors.accent,
  bgColor = Colors.card,
  subtitle,
  onPress,
  small = false,
}: StatCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: bgColor, opacity: pressed ? 0.88 : 1 }]}
    >
      <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon} size={small ? 18 : 22} color={color} />
      </View>
      <Text style={[styles.value, small && styles.valueSmall]}>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'flex-start',
    ...Shadow.card,
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    includeFontPadding: false,
  },
  valueSmall: {
    fontSize: FontSize.lg,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    marginTop: 2,
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
    includeFontPadding: false,
  },
});
