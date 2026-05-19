import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, operationLoading, user } = useAuth();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Already logged in
  React.useEffect(() => {
    if (user) router.replace('/(tabs)');
  }, [user]);

  const handleLogin = async () => {
    if (!email.trim()) {
      showAlert('Missing Email', 'Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      showAlert('Missing Password', 'Please enter your password.');
      return;
    }
    const { error } = await login(email.trim(), password);
    if (error) {
      showAlert('Login Failed', error);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <Image
            source={require('@/assets/images/hero-bg.png')}
            style={styles.heroBg}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.brand}>LS-ASENNUS</Text>
            <Text style={styles.tagline}>Workforce Management</Text>
          </View>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="lock" size={20} color={Colors.accent} />
            <Text style={styles.cardTitle}>Sign In</Text>
          </View>

          <Text style={styles.demoLabel}>Demo accounts:</Text>
          {[
            { email: 'admin@ls-asennus.fi', role: 'HR / Admin' },
            { email: 'supervisor@ls-asennus.fi', role: 'Supervisor' },
            { email: 'employee@ls-asennus.fi', role: 'Employee' },
          ].map(acc => (
            <Pressable
              key={acc.email}
              onPress={() => { setEmail(acc.email); setPassword('password123'); }}
              style={({ pressed }) => [styles.demoBtn, pressed && { opacity: 0.8 }]}
            >
              <View style={styles.demoBtnLeft}>
                <Text style={styles.demoBtnRole}>{acc.role}</Text>
                <Text style={styles.demoBtnEmail}>{acc.email}</Text>
              </View>
              <MaterialIcons name="north-west" size={14} color={Colors.textMuted} />
            </Pressable>
          ))}

          <View style={styles.divider} />

          <View style={styles.inputWrap}>
            <MaterialIcons name="email" size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email"
            />
          </View>

          <View style={styles.inputWrap}>
            <MaterialIcons name="lock" size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              accessibilityLabel="Password"
            />
            <Pressable onPress={() => setShowPass(v => !v)} hitSlop={8}>
              <MaterialIcons name={showPass ? 'visibility-off' : 'visibility'} size={18} color={Colors.textMuted} />
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.85 }]}
            disabled={operationLoading}
          >
            {operationLoading ? (
              <ActivityIndicator color={Colors.textLight} />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.footer}>LS-ASENNUS Oy  •  Turku, Finland</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flex: 1 },
  content: { gap: Spacing.md, paddingHorizontal: Spacing.md },
  heroSection: {
    height: 200,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  heroBg: { ...StyleSheet.absoluteFillObject },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,10,10,0.62)' },
  heroContent: { alignItems: 'center', gap: Spacing.xs },
  logo: { width: 56, height: 56, borderRadius: BorderRadius.md },
  brand: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textLight,
    letterSpacing: 2,
    includeFontPadding: false,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.medium,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.panel,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    includeFontPadding: false,
  },
  demoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dashboardBg,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
  demoBtnLeft: { gap: 1 },
  demoBtnRole: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    includeFontPadding: false,
  },
  demoBtnEmail: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    includeFontPadding: false,
  },
  divider: { height: 1, backgroundColor: Colors.borderCard, marginVertical: Spacing.xs },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dashboardBg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  inputIcon: {},
  input: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    includeFontPadding: false,
  },
  loginBtn: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  loginBtnText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.textLight,
    includeFontPadding: false,
  },
  footer: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
