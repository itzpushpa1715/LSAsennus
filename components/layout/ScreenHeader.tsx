import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightPress?: () => void;
  rightLabel?: string;
  showBorder?: boolean;
}

export const ScreenHeader = memo(function ScreenHeader({
  title,
  subtitle,
  rightIcon,
  onRightPress,
  rightLabel,
  showBorder = true,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.header, showBorder && styles.headerBorder]}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {(rightIcon || rightLabel) ? (
        <Pressable
          onPress={onRightPress}
          style={({ pressed }) => [styles.rightBtn, pressed && { opacity: 0.7 }]}
        >
          {rightLabel ? <Text style={styles.rightLabel}>{rightLabel}</Text> : null}
          {rightIcon ? <MaterialIcons name={rightIcon} size={22} color={Colors.accent} /> : null}
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
  },
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderCard,
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
    includeFontPadding: false,
  },
  rightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: Spacing.xs,
  },
  rightLabel: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.semibold,
    includeFontPadding: false,
  },
});
