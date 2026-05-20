import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(employee)" />
            <Stack.Screen name="(manager)" />
            <Stack.Screen name="(admin)" />
            {/* Legacy tabs kept for compat during transition */}
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="employee-detail" />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
