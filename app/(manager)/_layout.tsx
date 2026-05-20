// Manager tab navigator
import { Tabs, Redirect } from 'expo-router';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/theme';

export default function ManagerLayout() {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role === 'employee') return <Redirect href="/(employee)" />;
  if (user.role === 'admin') return <Redirect href="/(admin)" />;

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
      <Tabs.Screen name="schedule" options={{ title: 'Schedule', tabBarIcon: ({ color, size }) => <MaterialIcons name="calendar-month" size={size} color={color} /> }} />
      <Tabs.Screen name="approvals" options={{ title: 'Approvals', tabBarIcon: ({ color, size }) => <MaterialIcons name="rule" size={size} color={color} /> }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: ({ color, size }) => <MaterialIcons name="chat-bubble-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: ({ color, size }) => <MaterialIcons name="more-horiz" size={size} color={color} /> }} />
    </Tabs>
  );
}
