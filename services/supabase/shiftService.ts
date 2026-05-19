// Shift data service — OnSpace Cloud / Supabase
import { supabase } from './client';

export interface ShiftRow {
  id: string;
  employee_id: string | null;
  employee_name: string;
  date: string;
  start_time: string;
  end_time: string;
  type: 'morning' | 'evening' | 'night' | 'overtime' | 'weekend' | 'emergency';
  site: string;
  role: string;
  status: 'scheduled' | 'active' | 'completed' | 'missed' | 'cancelled';
  notes: string | null;
  created_at: string;
}

export async function fetchShifts(date?: string): Promise<{ data: ShiftRow[]; error: string | null }> {
  let query = supabase
    .from('shifts')
    .select('*')
    .order('date')
    .order('start_time');
  if (date) query = query.eq('date', date);
  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: data as ShiftRow[], error: null };
}

export async function fetchShiftsForDateRange(
  from: string,
  to: string
): Promise<{ data: ShiftRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .gte('date', from)
    .lte('date', to)
    .order('date')
    .order('start_time');
  if (error) return { data: [], error: error.message };
  return { data: data as ShiftRow[], error: null };
}

export async function fetchShiftsForEmployee(
  employeeId: string
): Promise<{ data: ShiftRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('employee_id', employeeId)
    .order('date', { ascending: false })
    .limit(10);
  if (error) return { data: [], error: error.message };
  return { data: data as ShiftRow[], error: null };
}
