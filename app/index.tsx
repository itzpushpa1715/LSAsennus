// Root index — detect auth state and redirect to role-based dashboard
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/theme';

export default function RootIndex() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/(auth)/login');
    } else if (user.role === 'admin') {
      router.replace('/(admin)');
    } else if (user.role === 'supervisor') {
      router.replace('/(manager)');
    } else {
      router.replace('/(employee)');
    }
  }, [user, isLoading]);

  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
});
