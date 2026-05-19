// Real Supabase Authentication Context for LS-ASENNUS
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/services/supabase/client';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { fetchUserProfile, updateUserProfile, type UserProfileRow } from '@/services/supabase/userProfileService';

export type UserRole = 'admin' | 'supervisor' | 'employee';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId: string | null;
  supabaseUser: SupabaseUser;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  operationLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildAppUser(supabaseUser: SupabaseUser, profile: UserProfileRow | null): AppUser {
  const name = profile?.full_name || supabaseUser.email?.split('@')[0] || 'User';
  return {
    id: supabaseUser.id,
    name,
    email: supabaseUser.email || '',
    role: (profile?.role as UserRole) || 'employee',
    department: 'General',
    employeeId: profile?.employee_id || null,
    supabaseUser,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    const { data: profile } = await fetchUserProfile(supabaseUser.id);
    setUser(buildAppUser(supabaseUser, profile));
  };

  useEffect(() => {

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    setOperationLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setOperationLoading(false);
    if (error) return { error: error.message };
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, operationLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
