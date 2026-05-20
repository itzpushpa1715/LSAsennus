// PrimaryButton — reusable CTA
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  icon?: string;
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, loading, disabled, variant = 'primary', icon, style }: Props) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const bg = isPrimary ? Colors.primary : isDanger ? Colors.danger : 'transparent';
  const borderColor = isOutline ? Colors.primary : isDanger ? Colors.danger : 'transparent';
  const textColor = isPrimary || isDanger ? Colors.textInverse : isOutline ? Colors.primary : Colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor, borderWidth: isOutline ? 1.5 : 0 },
        (disabled || loading) && styles.disabled,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        style,
      ]}
      accessibilityLabel={label}
    >
      {loading
        ? <ActivityIndicator color={textColor} size="small" />
        : <>
          {icon ? <MaterialIcons name={icon as any} size={18} color={textColor} /> : null}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </>
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 14, paddingHorizontal: 20,
    borderRadius: BorderRadius.md, ...Shadow.card,
  },
  disabled: { opacity: 0.5 },
  label: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, includeFontPadding: false },
});
