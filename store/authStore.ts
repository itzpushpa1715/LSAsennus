// Zustand auth store — wraps Supabase auth + user profile
import { create } from 'zustand';
import { supabase } from '@/services/supabase/client';
import { fetchUserProfile, type UserProfileRow } from '@/services/supabase/userProfileService';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { UserRole } from '@/constants/roles';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId: string | null;
  phone: string | null;
  supabaseUser: SupabaseUser;
}

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  operationLoading: boolean;
  // actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  _loadProfile: (su: SupabaseUser) => Promise<void>;
}

function buildUser(su: SupabaseUser, profile: UserProfileRow | null): AppUser {
  return {
    id: su.id,
    name: profile?.full_name || su.email?.split('@')[0] || 'User',
    email: su.email || '',
    role: (profile?.role as UserRole) || 'employee',
    department: 'General',
    employeeId: profile?.employee_id || null,
    phone: profile?.phone || null,
    supabaseUser: su,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  operationLoading: false,

  _loadProfile: async (su: SupabaseUser) => {
    const { data: profile } = await fetchUserProfile(su.id);
    set({ user: buildUser(su, profile) });
  },

  initialize: async () => {
    set({ isLoading: true });
    const { data: { session } } = await supabase.auth.getSession();
    set({ session });
    if (session?.user) {
      await get()._loadProfile(session.user);
    }
    set({ isLoading: false });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session });
      if (session?.user) {
        await get()._loadProfile(session.user);
      } else {
        set({ user: null });
      }
    });
  },

  login: async (email, password) => {
    set({ operationLoading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ operationLoading: false });
    if (error) return { error: error.message };
    return { error: null };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
