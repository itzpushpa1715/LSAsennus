import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const DEMO_ACCOUNTS = [
  { email: 'admin@ls-asennus.fi', role: 'HR / Admin', icon: 'admin-panel-settings' as const },
  { email: 'supervisor@ls-asennus.fi', role: 'Manager', icon: 'manage-accounts' as const },
  { email: 'employee@ls-asennus.fi', role: 'Employee', icon: 'person' as const },
];

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, operationLoading, user } = useAuth();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'admin') router.replace('/(admin)');
    else if (user.role === 'supervisor') router.replace('/(manager)');
    else router.replace('/(employee)');
  }, [user]);

  const handleLogin = async () => {
    if (!email.trim()) { showAlert('Missing Email', 'Please enter your email address.'); return; }
    if (!password.trim()) { showAlert('Missing Password', 'Please enter your password.'); return; }
    const { error } = await login(email.trim(), password);
    if (error) showAlert('Login Failed', error);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="factory" size={40} color={Colors.textInverse} />
          </View>
          <Text style={styles.brand}>LS-ASENNUS</Text>
          <Text style={styles.tagline}>Workforce Management System</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardSubtitle}>Enter your credentials to access your dashboard</Text>

          {/* Demo pills */}
          <Text style={styles.demoLabel}>Quick fill demo account:</Text>
          <View style={styles.demoRow}>
            {DEMO_ACCOUNTS.map(acc => (
              <Pressable
                key={acc.email}
                onPress={() => { setEmail(acc.email); setPassword('password123'); }}
                style={({ pressed }) => [styles.demoPill, pressed && { opacity: 0.75 }]}
              >
                <MaterialIcons name={acc.icon} size={13} color={Colors.primary} />
                <Text style={styles.demoPillText}>{acc.role}</Text>
              </Pressable>
            ))}
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputRow}>
              <MaterialIcons name="email" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="you@company.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Email address"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputRow}>
              <MaterialIcons name="lock-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter password"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                accessibilityLabel="Password"
              />
              <Pressable onPress={() => setShowPass(v => !v)} hitSlop={12}>
                <MaterialIcons name={showPass ? 'visibility-off' : 'visibility'} size={18} color={Colors.textMuted} />
              </Pressable>
            </View>
          </View>

          {/* Forgot */}
          <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          {/* Login btn */}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.88 }]}
            disabled={operationLoading}
            accessibilityLabel="Sign in"
          >
            {operationLoading
              ? <ActivityIndicator color={Colors.textInverse} />
              : <Text style={styles.loginBtnText}>Sign In</Text>
            }
          </Pressable>
        </View>

        <Text style={styles.footer}>LS-ASENNUS Oy  •  Turku, Finland  •  v2.0</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 24, gap: Spacing.lg },

  logoWrap: { alignItems: 'center', gap: Spacing.sm },
  logoCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    ...Shadow.strong,
  },
  brand: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary, letterSpacing: 2, includeFontPadding: false },
  tagline: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },

  card: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, gap: Spacing.md, ...Shadow.panel,
  },
  cardTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  cardSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: -8, includeFontPadding: false },

  demoLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.medium, textTransform: 'uppercase', letterSpacing: 0.5, includeFontPadding: false },
  demoRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  demoPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primaryFaded, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm + 4, paddingVertical: Spacing.xs + 2,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  demoPillText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold, includeFontPadding: false },

  field: { gap: Spacing.xs },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary, includeFontPadding: false },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: 14,
  },
  input: { flex: 1, fontSize: FontSize.body, color: Colors.textPrimary, includeFontPadding: false },

  forgotRow: { alignItems: 'flex-end', marginTop: -Spacing.xs },
  forgotText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium, includeFontPadding: false },

  loginBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingVertical: 16, alignItems: 'center', marginTop: Spacing.xs, ...Shadow.card,
  },
  loginBtnText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.textInverse, includeFontPadding: false },

  footer: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', includeFontPadding: false },
});
