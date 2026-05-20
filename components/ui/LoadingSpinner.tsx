// LoadingSpinner overlay
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

interface Props {
  overlay?: boolean;
  message?: string;
}

export function LoadingSpinner({ overlay, message }: Props) {
  return (
    <View style={[styles.root, overlay && styles.overlay]}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message ? <Text style={styles.msg}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 32 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    zIndex: 999,
  },
  msg: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
});
