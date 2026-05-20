// Redirect old tabs to new role-based navigator
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function OldTabsRedirect() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role === 'admin') return <Redirect href="/(admin)" />;
  if (user.role === 'supervisor') return <Redirect href="/(manager)" />;
  return <Redirect href="/(employee)" />;
}
