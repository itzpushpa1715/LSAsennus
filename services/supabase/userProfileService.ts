// User profile service — OnSpace Cloud / Supabase
import { supabase } from './client';

export interface UserProfileRow {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  role: 'admin' | 'supervisor' | 'employee';
  employee_id: string | null;
  phone: string | null;
}

export async function fetchUserProfile(userId: string): Promise<{ data: UserProfileRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as UserProfileRow, error: null };
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfileRow, 'full_name' | 'role' | 'employee_id' | 'phone'>>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId);
  if (error) return { error: error.message };
  return { error: null };
}

export async function getDashboardStats(date: string): Promise<{
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  shiftsToday: number;
  overtimeHoursThisWeek: number;
  attendanceRate: number;
  activeSites: number;
  pendingLeaves: number;
  expiringDocs: number;
}> {
  const client = supabase;

  const [empRes, attRes, shiftRes, siteRes, leaveRes, docRes] = await Promise.all([
    supabase.from('employees').select('id', { count: 'exact', head: true }),
    supabase.from('attendance').select('status').eq('date', date),
    supabase.from('shifts').select('id', { count: 'exact', head: true }).eq('date', date),
    supabase.from('sites').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('leave_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('employee_documents').select('status').in('status', ['expiring', 'expired']),
  ]);

  const attendance = (attRes.data || []) as { status: string }[];
  const present = attendance.filter(a => a.status === 'present').length;
  const absent = attendance.filter(a => a.status === 'absent').length;
  const late = attendance.filter(a => a.status === 'late').length;
  const total = (empRes.count || 0);
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  // Weekly overtime from attendance
  const { data: weekOT } = await supabase
    .from('attendance')
    .select('overtime_hours')
    .gte('date', date.substring(0, 8) + '13') // rough week start
    .lte('date', date);
  const otTotal = (weekOT || []).reduce((sum: number, r: any) => sum + (r.overtime_hours || 0), 0);

  return {
    totalEmployees: total,
    presentToday: present,
    absentToday: absent,
    lateToday: late,
    shiftsToday: shiftRes.count || 0,
    overtimeHoursThisWeek: Math.round(otTotal * 10) / 10,
    attendanceRate: rate,
    activeSites: siteRes.count || 0,
    pendingLeaves: leaveRes.count || 0,
    expiringDocs: (docRes.data || []).length,
  };
}
