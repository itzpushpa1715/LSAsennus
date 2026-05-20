import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase/client';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    setSent(true);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.textPrimary} />
          <Text style={styles.backText}>Back to Login</Text>
        </Pressable>

        <View style={styles.iconWrap}>
          <MaterialIcons name="lock-reset" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your work email and we'll send you a reset link.</Text>

        {sent ? (
          <View style={styles.successCard}>
            <MaterialIcons name="check-circle" size={32} color={Colors.success} />
            <Text style={styles.successTitle}>Email Sent!</Text>
            <Text style={styles.successMsg}>Check your inbox for the password reset link. It may take a few minutes.</Text>
            <Pressable onPress={() => router.back()} style={styles.backLoginBtn}>
              <Text style={styles.backLoginText}>Return to Login</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Work Email</Text>
            <View style={styles.inputRow}>
              <MaterialIcons name="email" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="you@ls-asennus.fi"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email"
              />
            </View>
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [styles.sendBtn, pressed && { opacity: 0.88 }]}
              disabled={loading || !email.trim()}
            >
              {loading
                ? <ActivityIndicator color={Colors.textInverse} />
                : <Text style={styles.sendBtnText}>Send Reset Link</Text>
              }
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 24, gap: Spacing.md },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.lg },
  backText: { fontSize: FontSize.body, color: Colors.textPrimary, fontWeight: FontWeight.medium, includeFontPadding: false },
  iconWrap: { alignItems: 'center', marginBottom: Spacing.sm },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, textAlign: 'center', includeFontPadding: false },
  subtitle: { fontSize: FontSize.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, includeFontPadding: false },
  card: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.lg, gap: Spacing.md, ...Shadow.panel },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary, includeFontPadding: false },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: 14,
  },
  input: { flex: 1, fontSize: FontSize.body, color: Colors.textPrimary, includeFontPadding: false },
  sendBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingVertical: 16, alignItems: 'center', ...Shadow.card,
  },
  sendBtnText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textInverse, includeFontPadding: false },
  successCard: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    padding: Spacing.xl, gap: Spacing.md, alignItems: 'center', ...Shadow.panel,
  },
  successTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  successMsg: { fontSize: FontSize.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, includeFontPadding: false },
  backLoginBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, marginTop: Spacing.sm },
  backLoginText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textInverse, includeFontPadding: false },
});
