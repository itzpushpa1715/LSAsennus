// Sites & Leave data service — OnSpace Cloud / Supabase
import { supabase } from './client';

export interface SiteRow {
  id: string;
  name: string;
  location: string;
  manager: string | null;
  total_workers: number;
  active_workers: number;
  current_shift: string;
  status: 'active' | 'inactive' | 'completed';
  created_at: string;
}

export interface LeaveRequestRow {
  id: string;
  employee_id: string | null;
  employee_name: string;
  type: 'sick' | 'annual' | 'unpaid' | 'emergency';
  start_date: string;
  end_date: string;
  days: number;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export async function fetchSites(): Promise<{ data: SiteRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('status', 'active')
    .order('name');
  if (error) return { data: [], error: error.message };
  return { data: data as SiteRow[], error: null };
}

export async function fetchLeaveRequests(): Promise<{ data: LeaveRequestRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: data as LeaveRequestRow[], error: null };
}

export async function updateLeaveStatus(
  leaveId: string,
  status: 'approved' | 'rejected',
  reviewedBy: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('leave_requests')
    .update({ status, reviewed_by: reviewedBy, reviewed_at: new Date().toISOString() })
    .eq('id', leaveId);
  if (error) return { error: error.message };
  return { error: null };
}

export async function submitLeaveRequest(
  employeeId: string,
  employeeName: string,
  type: LeaveRequestRow['type'],
  startDate: string,
  endDate: string,
  days: number,
  reason: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('leave_requests')
    .insert({ employee_id: employeeId, employee_name: employeeName, type, start_date: startDate, end_date: endDate, days, reason });
  if (error) return { error: error.message };
  return { error: null };
}
