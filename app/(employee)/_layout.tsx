// Employee tab navigator
import { Tabs, Redirect } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/theme';

export default function EmployeeLayout() {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role !== 'employee') {
    if (user.role === 'supervisor') return <Redirect href="/(manager)" />;
    return <Redirect href="/(admin)" />;
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
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="calendar" options={{ title: 'Schedule', tabBarIcon: ({ color, size }) => <MaterialIcons name="calendar-month" size={size} color={color} /> }} />
      <Tabs.Screen name="clock" options={{ title: 'Clock', tabBarIcon: ({ color, size }) => <MaterialIcons name="fingerprint" size={size + 4} color={color} /> }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks', tabBarIcon: ({ color, size }) => <MaterialIcons name="checklist" size={size} color={color} /> }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: ({ color, size }) => <MaterialIcons name="chat-bubble-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
