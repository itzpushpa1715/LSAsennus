// Admin tab navigator
import { Tabs, Redirect } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/theme';

export default function AdminLayout() {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role !== 'admin') {
    if (user.role === 'supervisor') return <Redirect href="/(manager)" />;
    return <Redirect href="/(employee)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.select({ ios: insets.bottom + 60, android: insets.bottom + 60, default: 70 }),
          paddingTop: 8,
          paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }),
          backgroundColor: Colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: Colors.tabBarBorder,
        },
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <MaterialIcons name="grid-view" size={size} color={color} /> }} />
      <Tabs.Screen name="employees" options={{ title: 'Employees', tabBarIcon: ({ color, size }) => <MaterialIcons name="people" size={size} color={color} /> }} />
      <Tabs.Screen name="schedule" options={{ title: 'Schedule', tabBarIcon: ({ color, size }) => <MaterialIcons name="calendar-month" size={size} color={color} /> }} />
      <Tabs.Screen name="finance" options={{ title: 'Finance', tabBarIcon: ({ color, size }) => <MaterialIcons name="bar-chart" size={size} color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: ({ color, size }) => <MaterialIcons name="more-horiz" size={size} color={color} /> }} />
    </Tabs>
  );
}
